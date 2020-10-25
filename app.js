const express = require('express');
const cors = require('cors');
const logger = require('morgan');

// const patientServices = require('./services/patient.service');
const patientController = require('./controllers/patient.controller');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

// app.use('/api/v1', patientsRouter);

app

    // .route('/patients')
    // .get(patientController.getAllPatients)
    // .post(patientController.registerPatient);

    // app.
    //     route('/patients/:id')
    //     .get(patientController.getOnePatient)



    // app
    //     .route('/login')
    //     .post(patientController.login)    

app.listen(process.env.PORT || 3000, () => console.log('Server listening'));

module.exports = app;
