const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//generatePassword:: generate hashed password
const generateHash = (plainPassword) => {
   const salt = bcrypt.genSaltSync();
   const hashedPassword = bcrypt.hashSync(plainPassword, salt);
   return hashedPassword;

}

//ComparePassword:: compare user password
const comparePassword = (encodedPassword, password) => {
    const isMatched = bcrypt.compareSync(password, encodedPassword);
    return isMatched;
}

//Entity:: patient, doctor, appointment and so on..
const checkIfUserExist = (userArr, userEmail) => {
    userArr = [];
    for(let i=0; i < userArr.length; i++){
        const user = userArr[i];
        if(user.email === userEmail){
            return true;
        }
        return false;
    }

}
 
//isValidEmail:: to check if user email is valid
const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
}


//getPMEquivalent:: get the PM equivalent of the date


//generateToken:: To generate token when user logs in
const generateToken = (id) => {
    const token = jwt.sign({ userId: id}, 
        process.env.SECRET, { expiresIn: '7d'}
    );
    return token;
}

// let token = generateToken(12);
// console.log(token);

module.exports = { generateHash, comparePassword, checkIfUserExist, isValidEmail, generateToken };