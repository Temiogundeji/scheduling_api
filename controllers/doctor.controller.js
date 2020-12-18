const moment = require('moment');
const model = require('../models');
const multer = require('multer');

require('dotenv').config();

const { generateHash, isValidEmail, generateToken, comparePassword } = require('../utils');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }
    cb(null, false);
}

const upload =  multer({
    storage: storage, 
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});


const doctorControllers = {
    registerDoctor: async (req, res) => {
        if(!req.body.d_fname || !req.body.d_lname || !req.body.email || !req.body.d_img || !req.body.pwd || !req.body.start_time || !req.body.end_time){
            return res.status(400).send({
                message: 'Some values are missing'
            });
        } 

        if(!isValidEmail(req.body.email)){
            return res.status(400).send({
                message: 'Please enter a valid email address'
            });
        }

        const userCheckText = `SELECT * FROM doctors WHERE email = $1`;
        const hashedPassword = generateHash(req.body.pwd);

        const userCheckVal = [req.body.email];
        const usersFound = await model.query(userCheckText, userCheckVal);


        if(usersFound.rows.length !== 0){
            res.status(400).send({
                message: 'User with that email already exists'
            });
        }

        const text = `INSERT INTO 
            doctors ("doctor_fname", "doctor_lname", "doctor_img", "email", "pwd", "start_time", "end_time", "created_date", "modified_date")
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            returning *`;

        const values = [
            req.body.d_fname,
            req.body.d_lname,
            req.body.d_img,
            req.body.email,
            hashedPassword,
            req.body.start_time,
            req.body.end_time,
            moment(new Date()),
            moment(new Date())
        ];

        try {
            const { rows } = await model.query(text, values);
            const token = generateToken(rows[0].id);
            console.log(token);
            res.status(201).send({
                data: rows[0],
                message: `Welcome Doctor ${rows[0].doctor_fname}`,
                status: 'success',
                token: token,
            });
        }
        catch(err){
            res.status(400).send({
               message: err,
               status: 'failed'
            });
        }
    },

    login: async (req, res) => {
        if(!req.body.email || !req.body.pwd){
            return res.status(400).send({'message': 'Incomplete user login parameter'});
        }

        if(!isValidEmail(req.body.email)){
            return res.status(400).send({ 'message': 'Please enter a valid email address' });
        }
        
        const text = `SELECT * FROM doctors WHERE email = $1`;
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
                message: `Welcome ${rows[0].doctor_fname}`,
                data: rows[0],
                status: 'success',
                token,
            });
        }
        catch(err){
            res.status(400).send(err)
        }
    },
    getAllDoctor:  async (req, res) => {
        const text = `SELECT * FROM doctors`;
        const values = [];

        try{
            const { rows, rowCount } = await model.query(text, values);
            res.status(200).send({
                data: rows,
                rowCount
            });
        }
        catch(err){
            res.status(400).send(err);
        }
    },

    getOneDoctor: async (req, res) => {
        const text = `SELECT * FROM doctors WHERE id = $1`;
        const values = [req.params.id];
        
        try{
            const { rows } = await model.query(text, values);
            res.status(200).send(rows);
        }
        catch(err){
            res.status(400).send(err);
        }
    }, 

    getDoctorsByTimeRange: async (req, res) => {}
};

module.exports = doctorControllers;