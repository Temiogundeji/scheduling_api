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
            res.status(400).send({ err })
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
    }
    //TODO --> grantAppointmentById:: grant appointment for a specific patient
    //TODO --> getAllGrantedAppointment:: get all granted appointment
    //TODO --> 
};


module.exports = appointmentControllers;