const express = require('express');
const cors = require('cors');
const logger = require('morgan');

const patientController = require('./controllers/patient.controller');
const doctorController = require('./controllers/doctor.controller');
const appointmentController = require('./controllers/appointment.controller');

const Auth = require('./middleware/auth');
const appointmentControllers = require('./controllers/appointment.controller');
const MessageControllers = require('./controllers/message.controller');
const videoController = require('./controllers/video.controller');
const pregControllers = require('./controllers/preg.contoller');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const isProduction = process.env.NODE_ENV === 'production'
const origin = {
    origin: isProduction ? 'https://www.example.com' : '*',
}

app.use(cors(origin));


app.get('/', (req, res) => {
    return res.status(200).send({ message: 'welcome Dev! you\'ve come a long way in a very short time..' });
});

app.post('/api/v1/videos', videoController.sendVideo);
app.post('/api/v1/preg', pregControllers.registerPreg);
app.post('/api/v1/preg-login', pregControllers.pregLogin);
app.get('/api/v1/pregs', pregControllers.getAllPregs);

app.get('/api/v1/pregs/appointments/:preg_id', appointmentController.getAppointmentsByPregID);
app.get('/api/v1/pregs/appointments/doctors/:doctor_id', appointmentController.getPregAppointmentsByDoctorID);
app.put('/api/v1/pregs/appointments/grant/:preg_id', appointmentController.grantPregAppointmentByID);

app.post('/api/v1/pregs/appointments', appointmentController.schedulePregAppointment);
app.post('/api/v1/pregs/messages', MessageControllers.sendPregMessage);
app.get('/api/v1/pregs/messages/:preg_id', MessageControllers.getMessagesByPregId);
app.get('/api/v1/pregs/messages/doctors/:doctor_id', MessageControllers.getPregMessagesByDoctorId);


// Doctor's:: Endpoints for doctor
app.post('/api/v1/doctors', doctorController.registerDoctor);
app.post('/api/v1/doctor/login', doctorController.login);
app.get('/api/v1/doctors', doctorController.getAllDoctor);
app.get('/api/v1/doctors', Auth.verifyDoctorToken, doctorController.getOneDoctor);

// Patient's:: Endpoints for patient
app.post('/api/v1/patients', patientController.registerPatient);
app.post('/api/v1/patient/login', patientController.login);
app.get('/api/v1/patients', patientController.getAllPatients);
app.get('/api/v1/patient/:id', Auth.verifyPatientToken, patientController.getOnePatient);

//Appointment's:: Endpoints for appointment
app.post('/api/v1/appointments', appointmentController.scheduleAppointment);
app.get('/api/v1/appointments/patients/:patient_id', appointmentController.getAppointmentsByPatientID);
app.get('/api/v1/appointments/doctors/:doctor_id', appointmentController.getAppointmentsByDoctorID);

app.put('/api/v1/appointments/grant/:id', appointmentController.grantAppointmentByID);

//Message's:: Endpoints for messages/
app.post('/api/v1/messages', MessageControllers.sendMessage);
//Get messages by doctor id
// app.get('/api/v1/messages', MessageControllers.getMessagesByDoctorId);
//Get messages by patient_id
app.get('/api/v1/messages/patients/:patient_id', MessageControllers.getMessagesByPatientId);
//Get messages by doctor_id
app.get('/api/v1/messages/doctors/:doctor_id', MessageControllers.getMessagesByDoctorId);

app.listen(process.env.PORT || 3000, () => console.log('Server listening at 3000'));

module.exports = app;
