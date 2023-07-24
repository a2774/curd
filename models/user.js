const mongoose = require('mongoose');

const {isEmail} = require('validator');
const userSchema =  mongoose.Schema({
    name:{
        type: String,
        require: true
        
    },
    email:{
        type: String,
        require: [true, 'please enter an email'],
        unique: true,
        lowercase: true,
        validate:[isEmail, 'please enter a valid email']

    },
    number:{
        type: Number,
        require: true
    },
    rollnumber:{
        type: Number,
        require: true
    }
});

const User = mongoose.model('User', userSchema)
module.exports = User;

