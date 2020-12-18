const model = require('../models');
const moment = require('moment');

require('dotenv').config();

const MessageControllers = {
    sendMessage: async(req, res) => {
        if( !req.body.message_title || !req.body.patient_id || !req.body.doctor_id || !req.body.message_body){
            return res.status(400).send({
                message: 'Some values are missing'
            });
        }

        const text = `INSERT INTO messages ("message_title", "message_body", "patient_id", "doctor_id", "created_at") VALUES ($1, $2, $3, $4, $5) returning *`;
        const values = [
            req.body.message_title,
            req.body.message_body,
            req.body.patient_id, 
            req.body.doctor_id,
            moment(new Date())
        ];

        try {
            const { rows } = await model.query(text, values);
            res.status(201).send({
                data: rows[0],
                message:`Message sent!`,
                status: 'success'
            });
        }
        catch(err){
            return res.status(400).send(err);
        }

    },
    sendPregMessage: async(req, res) => {
        if( !req.body.message_title || !req.body.preg_id || !req.body.doctor_id || !req.body.message_body){
            return res.status(400).send({
                message: 'Some values are missing'
            });
        }

        const text = `INSERT INTO pregmessages ("message_title", "message_body", "preg_id", "doctor_id", "created_at") VALUES ($1, $2, $3, $4, $5) returning *`;
        const values = [
            req.body.message_title,
            req.body.message_body,
            req.body.preg_id, 
            req.body.doctor_id,
            moment(new Date())
        ];

        try {
            const { rows } = await model.query(text, values);
            res.status(201).send({
                data: rows[0],
                message:`Message sent!`,
                status: 'success'
            });
        }
        catch(err){
            return res.status(400).send(err);
        }

    },
    // sendPregMessage: async(req, res) => {
    //     if(!req.body.message_title || !req.body.preg_id || !req.body.doctor_id || !req.body.message_body){
    //         return res.status(400).send({
    //             message: 'Some values are missing'
    //         });
    //     }

    //     const text = `INSERT INTO pregmessages ("message_title", "message_body", "preg_id", "doctor_id", "created_at") VALUES ($1, $2, $3, $4, $5) returning *`;
    //     const values = [
    //         req.body.message_title,
    //         req.body.message_body,
    //         req.body.preg_id, 
    //         req.body.doctor_id,
    //         moment(new Date())
    //     ];

    //     try {
    //         const { rows } = await model.query(text, values);
    //         res.status(201).send({
    //             data: rows[0],
    //             message:`Message sent!`,
    //             status: 'success'
    //         });
    //     }
    //     catch(err){
    //         return res.status(400).send(err);
    //     }

    // },
    getMessagesByDoctorId: async(req, res) => {
        // const text = `SELECT * FROM messages WHERE doctor_id = $1`;
        const text = `SELECT patients.patient_lname, patients.patient_fname, message_body,
        message_title,
        created_at
    FROM
        patients
    INNER JOIN messages
        ON patients.id = messages.patient_id
        WHERE doctor_id = $1;
        `;
        const values = [req.params.doctor_id];

        try {
            const { rows } = await model.query(text, values);
            res.status(200).send({
                data: rows,
                message: 'Messages fetched!',
                status: 'success'
            });
        }
        catch(err){
            console.log(err);
        }
    },
    getPregMessagesByDoctorId: async(req, res) => {
        // const text = `SELECT * FROM messages WHERE doctor_id = $1`;
        const text = `SELECT preg.patient_lname, preg.patient_fname, message_body,
        message_title,
        created_at
    FROM
        preg
    RIGHT JOIN pregmessages
        ON preg.id = pregmessages.preg_id
        WHERE doctor_id = $1;
        `;
        const values = [req.params.doctor_id];

        try {
            const { rows } = await model.query(text, values);
            res.status(200).send({
                data: rows,
                message: 'Messages fetched!',
                status: 'success'
            });
        }
        catch(err){
            console.log(err);
        }
    },
    getMessagesByPatientId: async(req, res) => {
        const text = `SELECT doctors.doctor_lname, doctors.doctor_fname, messages.message_title, messages.message_body
    FROM
        doctors
    INNER JOIN messages
        ON doctors.id = messages.id
        WHERE patient_id = $1;
        `;
        const values = [req.params.patient_id];

        try {
            const { rows } = await model.query(text, values);
            res.status(200).send({
                data: rows,
                message: 'Messages fetched',
                status: 'success'
            });
        }
        catch(err){
            console.log(err)
        }
    },
    getMessagesByPregId: async(req, res) => {
        const text = `SELECT doctors.doctor_lname, doctors.doctor_fname, pregmessages.message_title, pregmessages.message_body
    FROM
        doctors
    INNER JOIN pregmessages
        ON doctors.id = pregmessages.doctor_id
        WHERE preg_id = $1;
        `;
        const values = [req.params.preg_id];

        try {
            const { rows } = await model.query(text, values);
            res.status(200).send({
                data: rows,
                message: 'Messages fetched',
                status: 'success'
            });
        }
        catch(err){
            console.log(err)
        }
    }
};
module.exports = MessageControllers;