const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

let user = new mongoose.Schema({
    name: {
        type :String,
        // required : true,
    },
    email: {
        type :String,
        // required : true,
    },
    password: {
        type :String,
        // required : true,
    },
    image: {
        type :String,
        // required : true,
    },
    joiningdate: {
        type :String,
        // required : true,
    },
    userType : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "userType" 
    },
    loginCount: {
        type: Number,
        default: 0, // Default value set to 0
    },
    password_token: {
        type : String,
    }
   
    
})

let User = mongoose.model('user',user)
module.exports = User;