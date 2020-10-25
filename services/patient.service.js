const {pool} = require('../config');
const bcrypt = require('bcrypt');
const moment = require('moment');
console.log(moment.now());


const checkIfPatientExist = (userEmail) => {
    pool.query('SELECT * FROM patients WHERE email = $1', [userEmail], (error, results) => {
        if(error){
            throw error
        }
        return results.rows.length;
    });
}

const  registerPatient = (req, res) => {
    const {p_fname, p_lname, email, pwd, frequent_ailment} = req.body;
        // if(!p_fname, !p_lname, !email, !pwd, !frequent_ailment){
        //     res.json({
        //         mesage: "User data is incomplete!"
        //     });
        // }
        const hashed = generateHash(10, pwd);
        // if(checkIfPatientExist(email) === 0){
            pool.query('INSERT INTO patients ("patient_fname", "patient_lname", "email", "pwd", "frequent_ailment") VALUES ($1, $2, $3, $4, $5)', 
            [p_fname, p_lname, email, hashed, frequent_ailment],
            (error) => {
            if(error){
                throw error;
            }
            return res.status(201).json({
                message: "Patient record has been created successfully",
                status: "success"
            });
        }
        );
    // }
}

// const registerPatient = (req, res) => {
//     const {p_fname, p_lname, email, }
// }

const loginPatient = (req, res) => {
    const { email, password } = req.body;
    if( !email || !password ) res.json({ message: "email or password not entered" });
    const passwordMatch = comparePassword();
    pool.query(`SELECT patient_fname FROM patients WHERE email = $1 AND password = $2`, [email, password], (error) => {
        if(error) throw error;
        res.status(201).json({
            message: "Login successful",
            status:"success"
        });
    })
    .catch(error => {
        console.log(error)
    });
}

const getSinglePatient = (req, res) => {
    const { id } = req.params;
    id = parseInt(id);
    pool.query(`SELECT * FROM patients WHERE patient_id = $1`, [id], (error, results) => {
        if(error) throw error;
        let user = results[0];
        res.status(200).json({
            message: "User successfully returned",
            data: user,
            status: "success"
        });
    });
}

const getAllPatients = (req, res) => {
    pool.query('SELECT * FROM patients', (error, results) => {
        if(error) throw error;
        let users = results.rows;
        res.status(200).json({
            message: "users successfully returned",
            data: users,
            status: "success"
        })
    })
}


module.exports = { registerPatient, loginPatient, getSinglePatient, getAllPatients}
