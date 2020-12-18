const moment = require('moment');
const models = require('../models');
const auth = require('../middleware/auth');

//Appointment Controller:: All controllers dealing with user appointment.

const appointmentControllers = {

    //TODO --> scheduleAppointment:: schedule an appointment with a specific doctor
    scheduleAppointment: async(req, res) => {
        if(!req.body.d_id || !req.body.p_id || !req.body.complaint || !req.body.appointment_date){
            return res.status(400).send({
                message: 'Some values are missing'
            });
        }

        const appointmentCheckQuery = `SELECT * FROM appointments WHERE appointment_date = $1`;

        //SELECT EXTRACT(HOUR FROM TIMESTAMP $1)
        const appointmentCheckValue = [req.body.appointment_date];
        const appointmentsFound = await models.query(appointmentCheckQuery, appointmentCheckValue);

        if(appointmentsFound.rows.length !== 0){
            res.status(400).send({
                message: 'An appointment has been schedule for that time'
            });
        }

        const insertAppointmentQuery = `INSERT INTO appointments ("doctor_id", "patient_id", "complaint", "appointment_date", "created_at") VALUES ($1, $2, $3, $4, $5) returning *`;

        
        const appointmentValue = [
            req.body.d_id,
            req.body.p_id,
            req.body.complaint, 
            req.body.appointment_date,
            moment(new Date())
        ]

        try {
            const { rows } = await models.query(insertAppointmentQuery, appointmentValue);
            res.status(200).send({
                data: rows
            })
        }
        catch(err){
            // res.status(400).send({ err })
            res.status(400).send({
                err
            });
        }
    },

    //TODO --> scheduleAppointment:: schedule an appointment with a specific doctor
    schedulePregAppointment: async(req, res) => {
        if(!req.body.d_id || !req.body.p_id || !req.body.complaint || !req.body.appointment_date){
            return res.status(400).send({
                message: 'Some values are missing'
            });
        }

        const appointmentCheckQuery = `SELECT * FROM pregappointments WHERE appointment_date = $1`;

        //SELECT EXTRACT(HOUR FROM TIMESTAMP $1)
        const appointmentCheckValue = [req.body.appointment_date];
        const appointmentsFound = await models.query(appointmentCheckQuery, appointmentCheckValue);

        if(appointmentsFound.rows.length !== 0){
            res.status(400).send({
                message: 'An appointment has been schedule for that time'
            });
        }

        const insertAppointmentQuery = `INSERT INTO pregappointments ("doctor_id", "preg_id", "complaint", "appointment_date", "created_at") VALUES ($1, $2, $3, $4, $5) returning *`;

        
        const appointmentValue = [
            req.body.d_id,
            req.body.p_id,
            req.body.complaint, 
            req.body.appointment_date,
            moment(new Date())
        ]

        try {
            const { rows } = await models.query(insertAppointmentQuery, appointmentValue);
            res.status(201).send({
                data: rows
            })
        }
        catch(err){
            // res.status(400).send({ err })
            res.status(400).send({
                err
            });
        }
    },

    //TODO --> getAppointmentsByPatientID:: get appointments by patient ID
    getAppointmentsByPatientID: async (req, res) => {
        let values = [req.params.patient_id];

        const getAppointmentsQuery = `SELECT doctors.doctor_lname, doctors.doctor_fname, complaint,
        appointment_status,
        appointment_date
    FROM
        doctors
    INNER JOIN appointments
        ON doctors.id = appointments.id
        WHERE patient_id = $1;
        `;

        try {
            const { rows, rowCount } = await models.query(getAppointmentsQuery, values);
            res.status(200).send({
                data: rows,
                numOfAppointments: `You have booked ${rowCount} appointments`,
                status: 'success'
            });
        }
        catch(err){
            console.log(err);
        }
    },

    //TODO --> getAppointmentsByPatientID:: get appointments by patient ID
    getAppointmentsByPregID: async (req, res) => {
        let values = [req.params.preg_id];

        const getAppointmentsQuery = `SELECT doctors.doctor_lname, doctors.doctor_fname, complaint,
        appointment_status,
        appointment_date
    FROM
        doctors
    INNER JOIN pregappointments
        ON doctors.id = pregappointments.doctor_id
        WHERE preg_id = $1;
        `;

        try {
            const { rows, rowCount } = await models.query(getAppointmentsQuery, values);
            res.status(200).send({
                data: rows,
                numOfAppointments: `You have booked ${rowCount} appointments`,
                status: 'success'
            });
        }
        catch(err){
            console.log(err);
        }
    },

    getAppointmentsByDoctorID: async (req, res) => {
        let values = [req.params.doctor_id];
        const getAppointmentsQuery = `SELECT appointments.id, patients.patient_lname, patients.patient_fname, patients.patient_img, complaint,
            appointment_status,
            appointment_date
        FROM
            patients
        INNER JOIN appointments
            ON patients.id = appointments.patient_id
        WHERE doctor_id = $1;
        `;

        
        try {
            const { rows, rowCount } = await models.query(getAppointmentsQuery, values);
            res.status(200).send({
                data: rows,
                numOfAppointments: `${rowCount} appointments have been booked with you.`,
                status: 'success'
            });
        }
        catch(err){
            console.log(err);
        }
    },
    // getPregAppointmentsByDoctorID: async (req, res) => {
    //     let values = [req.params.doctor_id];
    //     const getAppointmentsQuery = `SELECT pregappointments.id, preg.patient_lname, preg.patient_fname, complaint,
    //         appointment_status,
    //         appointment_date
    //     FROM
    //         preg
    //     JOIN pregappointments
    //         ON preg.id = pregappointments.preg_id
    //     WHERE doctor_id = $1;
    //     `;

        
    //     try {
    //         const { rows, rowCount } = await models.query(getAppointmentsQuery, values);
    //         res.status(200).send({
    //             data: rows,
    //             numOfAppointments: `${rowCount} appointments have been booked with you.`,
    //             status: 'success'
    //         });
    //     }
    //     catch(err){
    //         console.log(err);
    //     }
    // },

    getPregAppointmentsByDoctorId: async(req, res) => {
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

    getPregAppointmentsByDoctorID: async (req, res) => {
        let values = [req.params.doctor_id];
        const getAppointmentsQuery = `SELECT pregappointments.id, preg.patient_lname, preg.patient_fname, preg.patient_img, complaint,
            appointment_status,
            appointment_date
        FROM
            preg
        INNER JOIN pregappointments
            ON preg.id = pregappointments.preg_id
        WHERE doctor_id = $1;
        `;

        
        try {
            const { rows, rowCount } = await models.query(getAppointmentsQuery, values);
            res.status(200).send({
                data: rows,
                numOfAppointments: `${rowCount} appointments have been booked with you.`,
                status: 'success'
            });
        }
        catch(err){
            console.log(err);
        }
    },
    //TODO --> checkIfAppointmentExist:: check if appointment exist at a specific time
    //TODO --> terminateAppointment:: terminate an appointment with a specific patient
    //TODO --> getAllAppointment:: get all appointments
    //TODO --> getAllAppointmentsWithADoctor:: get all appointment with a specific doctor
    getAllAppointmentWithADoctor: async (req, res) => {
        const text = `SELECT * FROM appointments WHERE doctor_id = $1`;
        //get doctorId from the token
        const decoded = auth.verifyPatientToken;
        const value = [];
    },
    
    

    grantAppointmentByID: async (req, res) => {
        const text = `UPDATE appointments SET appointment_status ='1' WHERE id=$1 `;
        let values = [req.params.id];

        try{
            const { rows } = await models.query(text,values);
            return res.status(200).send({
                status: 'success'
            });
        }
        catch(err){
            console.log(err);
        }
    },  
    grantPregAppointmentByID: async (req, res) => {
        const text = `UPDATE pregappointments SET appointment_status ='1' WHERE id=$1 `;
        let values = [req.params.id];

        try{
            const { rows } = await models.query(text,values);
            return res.status(200).send({
                status: 'success'
            });
        }
        catch(err){
            console.log(err);
        }
    }
};


module.exports = appointmentControllers;