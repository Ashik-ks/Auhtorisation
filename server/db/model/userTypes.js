const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    userType: {
        type :String,
        // required : true,
    },
    
})

module.exports = mongoose.model("userType", userSchema);
