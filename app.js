const express = require('express');
const cors = require('cors');
const logger = require('morgan');

const patientController = require('./controllers/patient.controller');
const Auth = require('./middleware/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.get('/', (req, res) => {
    return res.status(200).send({ message: 'welcome Dev! you\'ve come a long way in a very short time..' });
});

app.post('/api/v1/patients', patientController.registerPatient);
app.post('/api/v1/patient/login', patientController.login);
app.get('/api/v1/patients', Auth.verifyToken, patientController.getAllPatients);
app.get('/api/v1/patient/:id', Auth.verifyToken, patientController.getOnePatient);



app.listen(process.env.PORT || 3000, () => console.log('Server listening'));


module.exports = app;
