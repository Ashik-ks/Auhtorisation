let users =  require('../db/model/model');
const {success_function,error_function} = require('../utils/responsehandler');
const bcrypt = require('bcrypt')

exports.Adduser = async function (req,res){
    try {
         let body = req.body;
         console.log("body : ",body);

         let salt = bcrypt.genSaltSync(10);
         console.log("salt : ",salt);

         let hashedpassword= bcrypt.hashSync(body.password,salt)
         console.log("hashedpassword : ",hashedpassword);

         let email = body.email;
         console.log("email : ",email)

         let count = await users.countDocuments({ email });
         console.log("email : ",email);

         if(count > 0){
            let response = error_function({
                success : false,
                statuscode : 400,
                message : "user not added",
            })
            res.status(response.statuscode).send(response);
         }

         body.password = hashedpassword;
         console.log("body.password : ",body.password)

         let Add_user = await users.create(body);
         console.log("Add_user : ",Add_user)
        
         let response = {
            success : true,
            statuscode : 200,
            message : "user added succesfully",
        }
        res.status(response.statuscode).send(response);
        return;

    } catch (error) {
        console.log("error : ",error)
        let response = {
            success : false,
            statuscode : 400,
            message : "user not added",
        }
        res.status(response.statuscode).send(response);
    }
}

exports.GetAlluser = async function (req,res){
    try {

        let users_Data = await users.find();

        let response = {
            success : true,
            statuscode : 200,
            message : "user added succesfully",
            data : users_Data
        }
        res.status(response.statuscode).send(response);
        return;

    } catch (error) {
        console.log("error : ",error)
        let response = {
            success : false,
            statuscode : 400,
            message : "Something went wrong",
        }
        res.status(response.statuscode).send(response);
    }
}