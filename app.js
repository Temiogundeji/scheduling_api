const express = require('express');
const cors = require('cors');
const logger = require('morgan');

const patientController = require('./controllers/patient.controller');
const doctorController = require('./controllers/doctor.controller');
const appointmentController = require('./controllers/appointment.controller');

const Auth = require('./middleware/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.get('/', (req, res) => {
    return res.status(200).send({ message: 'welcome Dev! you\'ve come a long way in a very short time..' });
});

// Doctor's:: Endpoints for doctor
app.post('/api/v1/doctors', doctorController.registerDoctor);
app.post('/api/v1/doctors', doctorController.login);
app.get('/api/v1/doctors', Auth.verifyDoctorToken, doctorController.getAllDoctor);
app.get('/api/v1/doctors', Auth.verifyDoctorToken, doctorController.getOneDoctor);

// Patient's:: Endpoints for patient
app.post('/api/v1/patients', patientController.registerPatient);
app.post('/api/v1/patient/login', patientController.login);
app.get('/api/v1/patients', Auth.verifyPatientToken, patientController.getAllPatients);
app.get('/api/v1/patient/:id', Auth.verifyPatientToken, patientController.getOnePatient);

//Appointment's:: Endpoints for appointment
app.post('/api/v1/appointments', Auth.verifyPatientToken, appointmentController.scheduleAppointment);

app.listen(process.env.PORT || 3000, () => console.log('Server listening at 3000'));


module.exports = app;
