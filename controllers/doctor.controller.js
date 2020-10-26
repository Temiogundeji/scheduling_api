const moment = require('moment');
const model = require('../models');

require('dotenv').config();

const { generateHash, isValidEmail, generateToken, comparePassword } = require('../utils');



const doctorControllers = {
    registerDoctor: async (req, res) => {
        if(!req.body.d_fname || !req.body.d_lname || !req.body.email || !req.body.pwd || !req.body.start_time || !req.body.end_time){
            
        }
    },

    getOneDoctor: async (req, res) => {

    }, 

    getAllDoctor:  async (req, res) => {

    },


};