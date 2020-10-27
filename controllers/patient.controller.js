const moment = require('moment');
const model = require('../models');

require('dotenv').config();

const { generateHash, isValidEmail, generateToken, comparePassword } = require('../utils');

const patientControllers = {
    registerPatient : async(req, res) =>{

        if(!req.body.p_fname || !req.body.p_lname || !req.body.email || !req.body.pwd || !req.body.genotype || !req.body.blood_group || !req.body.frequent_ailment ){
            return res.status(400).send({
                message: 'Some values are missing'
            });
        }
        
        if(!isValidEmail(req.body.email)){
            return res.status(400).send({
                message:'Please enter a valid email address'
            });
        }

        const userCheckText = `SELECT * FROM patients WHERE email = $1`;
        const hashedPassword = generateHash(req.body.pwd);

        const userCheckVal = [req.body.email];
        const usersFound = await model.query(userCheckText, userCheckVal);


        if(usersFound.rows.length !== 0){
            res.status(400).send({
                message: 'User with that email already exists'
            });
        }
        const text = `INSERT INTO 
                patients ("patient_fname", "patient_lname", "email", "pwd", "patient_img", "genotype", "blood_group", "frequent_ailment", created_date, modified_date)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                returning *`;

        const values = [
            req.body.p_fname,
            req.body.p_lname,
            req.body.email,
            hashedPassword,
            req.body.p_img,
            req.body.genotype,
            req.body.blood_group,
            req.body.frequent_ailment,
            moment(new Date()),
            moment(new Date())
        ];

        try{
            const { rows } = await model.query(text, values);
            const token = generateToken(rows[0].id);
            // console.log(token);
            res.status(201).send({
                data: rows[0],
                token: token
            });
        }
        catch(err){
            console.log(err);
        }


    },
    login: async (req, res) => {
        if(!req.body.email || !req.body.pwd){
            return res.status(400).send({'message': 'Incomplete user login parameter'});
        }

        if(!isValidEmail(req.body.email)){
            return res.status(400).send({ 'message': 'Please enter a valid email address' });
        }

        const text = `SELECT * FROM patients WHERE email = $1`;
        try {
            const { rows } = await model.query(text, [req.body.email]);
            if(!rows[0]){
                return res.status(400).send({'message': 'The credentials you provided is incorrect'});
            }
            
            if(!comparePassword(rows[0].pwd, req.body.pwd)) {
                return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
            }
              const token = generateToken(rows[0].id);
              
              return res.status(200).send({ 
                message: `Welcome ${rows[0].patient_fname}`,
                data: rows[0],
                token,
            });
        }
        catch(err){
            res.status(400).send(err)
        }



    },
    getAllPatients: async (req, res) => {
        const text = `SELECT * FROM patients`;
        const values = [];

        try {
            const { rows, rowCount } = await model.query(text, values);
            res.status(200).send({
                data: rows,
                rowCount 
            });
        }
        catch(err) {
            console.log(err);
        }
    },
    getOnePatient: async (req, res) => {
        const text = `SELECT * FROM patients WHERE id = $1`;
        const values = [req.params.id];

        try{
            const {rows} = await model.query(text, values);
            res.status(200).send(rows);
        }
        catch(err){
            console.log(err);
        }
    },
    deleteUser: async(req, res) => {
        const deleteQuery = `DELETE FROM patients WHERE id = $1 returning *`;
        try{
            const { rows } = await model.query(deleteQuery, [req.body.id]);
            if(!rows[0]){
                return res.status(404).send({ message: 'Patient not found'});
            }

            return res.status(204).send({ message: 'Deleted' });
        }
        catch(err) {
            res.status(400).send(err);
        }
    },
    updateOnePatient: async (req, res) => {
        const findOneQuery = `SELECT * FROM patients WHERE id=$1`;
        const updateOneQuery = `UPDATE patients SET patient_fname = $1, patient_lname= $2, email= $3, pwd=$4, genotype=$5, blood_group=$6, frequent_ailment=$7, modified_date=$8 WHERE id = $9 returning *`;

        try{
            const {rows} = await model.query(findOneQuery, [req.params.id]);
            if(!rows[0]){
                return res.status(404).send({
                    message: 'Patient not found'
                });
            }

            const values = [
                req.body.p_fname,
                req.body.p_lname,
                req.body.email,
                req.body.pwd,
                req.body.genotype,
                req.body.blood_group,
                req.body.frequent_ailment,
                moment(new Date())
            ];

            const response = await model.query(updateOneQuery, values);
            return res.status(200).send(response.rows[0]);
        }
        catch(err){
            res.status(400).send(err);
        }

    },
    deletePatient: async(req, res) => {
        const deleteQuery = 'DELETE FROM patients WHERE id=$1 returning *';
        try {
        const { rows } = await db.query(deleteQuery, [req.params.id]);
        if(!rows[0]) {
            return res.status(404).send({'message': 'patient not found'});
        }
        return res.status(204).send({ 'message': 'deleted' });
        } catch(error) {
        return res.status(400).send(error);
        }
    }
}

module.exports = patientControllers;