const jwt = require('jsonwebtoken');
const model = require('../models');

require('dotenv').config();

const Auth = {
    //verifyToken:: verify user token

    verifyPatientToken: async(req, res, next) => {
        const token = req.headers['x-access-token'];
        if(!token){
            return res.status(400).send({ message: 'Token is not provided!' });
        }

        try{
            const decoded = await jwt.verify(token, process.env.SECRET);
            const text = `SELECT * FROM patients WHERE id = $1`;
            const {rows} = await model.query(text, [decoded.userId]);
            
            if(!rows[0]){
                return status(400).send({ message: 'The token provided is invalid' });
            }

            req.patient = { id: decoded.userId };
            next();
        }
        catch(err){
            return res.status(400).send(err);
        }
    },

    verifyDoctorToken: async (req, res) => {
        const token = req.headers['x-access-token'];
        if(!token){
            return res.status(400).send({ message: 'Token is not provided!' });
        }

        try{
            const decoded = await jwt.verify(token, process.env.SECRET);
            const text = `SELECT * FROM doctors WHERE id = $1`;
            const {rows} = await model.query(text, [decoded.userId]);
            
            if(!rows[0]){
                return status(400).send({ message: 'The token provided is invalid' });
            }

            req.doctor = { id: decoded.userId };
            next();
        }
        catch(err){
            return res.status(400).send(err);
        }
    }
};

module.exports  = Auth;