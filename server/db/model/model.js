const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

let user = new mongoose.Schema({
    email: {
        type :String,
        // required : true,
    },
    password: {
        type :String,
        // required : true,
    },
   
    
})

let User = mongoose.model('user',user)
module.exports = User;