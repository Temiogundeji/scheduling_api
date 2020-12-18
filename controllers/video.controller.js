const model = require('../models');
const auth = require('../middleware/auth');
const moment = require('moment');
const videoController = {
    sendVideo: async(req, res) => {
        if( !req.body.video_title || !req.body.video_link || !req.body.doctor_id || !req.body.patient_id){
            return res.status(400).send({
                message: 'Some values are missing'
            });
        }

        const text = `INSERT INTO videos ("video_title", "video_link",  "doctor_id", "patient_id", "created_at") VALUES ($1, $2, $3, $4, $5) returning *`;
        const values = [
            req.body.video_title,
            req.body.video_link,
            req.body.doctor_id,
            req.body.patient_id, 
            moment(new Date())
        ];

        try {
            const { rows } = await model.query(text, values);
            res.status(201).send({
                data: rows[0],
                message:`Video sent!`,
                status: 'success'
            });
        }
        catch(err){
            return res.status(400).send(err);
        }

    },
    getVideosByDoctorId: async(req, res) => {
        const text = `SELECT * FROM videos WHERE patient_id = $1`;
        const values = [req.params.patient_id];

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
    getVideosByPatientId: async(req, res) => {
        const text = `SELECT * FROM videos WHERE patient_id = $1`;
        const values = [req.params.patient_id];

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
    }

};

module.exports = videoController;