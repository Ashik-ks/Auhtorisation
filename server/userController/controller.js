let users = require('../db/model/model');
const { success_function, error_function } = require('../utils/responsehandler');
const bcrypt = require('bcrypt')
const userType = require('../db/model/userTypes')
const fileUpload = require('../utils/file-upload').fileUpload;
const fileDelete = require('../utils/file-delete').fileDelete;
const path = require('path');
const set_password_template =
  require("../utils/email-templates/set-password").resetPassword;
  const sendEmail = require("../utils/send-email").sendEmail;

exports.Adduser = async function (req, res) {
    try {
        let body = req.body;
        console.log("bodys : ", body);

        let user_Type = await userType.findOne({ userType: req.body.userType });
        body.userType = user_Type._id


        function generateRandomNumber(length) {
            var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var password = "";
          
            for (var i = 0; i < length; i++) {
              var randomIndex = Math.floor(Math.random() * charset.length);
              password += charset.charAt(randomIndex);
            }
          
            return password;
          }
          
          var numberLength = 10; // Set the desired password length here
          var randomNumber = generateRandomNumber(numberLength);
          console.log(randomNumber);

          let email_template = await set_password_template(body.name,body.email,randomNumber)
          await sendEmail(body.email,"User created",email_template)

        let salt = bcrypt.genSaltSync(10);
        console.log("salt : ", salt);

        let hashedpassword = bcrypt.hashSync(randomNumber, salt)
        console.log("hashedpassword : ", hashedpassword);

        let newbody = {
            email : req.body.email,
            name : req.body.name,
            joiningdate : req.body.joiningdate,
            image : req.body.image,
            userType :  req.body.userType,
            password : hashedpassword

        }

        let email = body.email;
        console.log("email : ", email)

        let count = await users.countDocuments({ email });
        console.log("email : ", email);

        if (count > 0) {
            let response = error_function({
                success: false,
                statuscode: 400,
                message: "user not added",
            })
            res.status(response.statuscode).send(response);
        }

        // body.password = hashedpassword;
        // console.log("body.password : ", body.password)

        let image = body.image;
        console.log("image : ", image)

        if (image) {
            let img_path = await fileUpload(image, "movie");
            console.log("img_path", img_path);
            body.image = img_path
        }

        let Add_user = await users.create(newbody);
        console.log("Add_user : ", Add_user)

        let response = {
            success: true,
            statuscode: 200,
            message: "user added succesfully",
        }
        res.status(response.statuscode).send(response);
        return;

    } catch (error) {
        console.log("error : ", error)
        let response = {
            success: false,
            statuscode: 400,
            message: "user not added",
        }
        res.status(response.statuscode).send(response);
    }
}

exports.GetAlluser = async function (req, res) {
    try {

        let users_Data = await users.find();

        let response = {
            success: true,
            statuscode: 200,
            message: "user added succesfully",
            data: users_Data
        }
        res.status(response.statuscode).send(response);
        return;

    } catch (error) {
        console.log("error : ", error)
        let response = {
            success: false,
            statuscode: 400,
            message: "Something went wrong",
        }
        res.status(response.statuscode).send(response);
    }
}

exports.GetSingleuser = async function (req, res) {

    try {
        id = req.params.id;
        console.log("id : ", id);

        let single_user = await users.find({ _id: id });

        let response = {
            success: true,
            statuscode: 200,
            message: "single user getted",
            data: single_user
        }
        res.status(response.statuscode).send(response);
        return;
    } catch (error) {

        let response = {
            success: false,
            statuscode: 400,
            message: "single user not getted",
            // data: single_user
        }
        res.status(response.statuscode).send(response);
        return;
    }

}

exports.edituser = async function (req, res) {

    try {
        let body = req.body;
        console.log("body : ", body);

        let _id = req.params.id;
        console.log("_id : ", _id);

        let findUserType = await userType.findOne({ userType: body.userType }).populate("userType");
        console.log("findUserType : ", findUserType);

        let userType_id = findUserType._id;
        console.log("userType_id : ", userType_id);

        if(body.password){
            let salt = bcrypt.genSaltSync(10);
        console.log("salt : ", salt);

        let hashedpassword = bcrypt.hashSync(body.password, salt)
        console.log("hashedpassword : ", hashedpassword);
        body.password = hashedpassword;
        }

        body.userType = userType_id;

        let splittedImg;

        if (body.image) {

            let image_path = await users.findOne({ _id });

            splittedImg = image_path.image.split('/')[2];
            console.log("splittedIMG : ", splittedImg);

            let image = body.image;
            console.log("image :", image);

            let img_path = await fileUpload(image, "movie");
            console.log("img_path", img_path);
            body.image = img_path

        }
        

        let Update_user = await users.updateOne({ _id }, { $set: body })
        console.log("Update_user : ", Update_user);

        if(body.image){
            const imagePath = path.join('./uploads', 'movie', splittedImg);
            fileDelete(imagePath);
        }

        let response = success_function({
            success: true,
            statuscode: 200,
            message: "user Updated Succesfully",
            data: Update_user,
        });

        res.status(response.statuscode).send(response);
        return;

    } catch (error) {

        console.log("error : ", error)
        let response = {
            success: false,
            statuscode: 400,
            message: "user Updation Failed",
        }
        res.status(response.statuscode).send(response);

    }
}

exports.Deleteuser = async function (req, res) {
    try {

        let _id = req.params.id;
        console.log("_id : ", _id);

        let Delete_user = await users.deleteOne({ _id });
        console.log("Delete_user : ", Delete_user);

        let response = {
            success: true,
            statuscode: 200,
            message: "user Deleted Succesfully",
            data: Delete_user,
        }
        res.status(response.statuscode).send(response);
        return;

    } catch (error) {
        console.log("error : ", error)
        let response = {
            success: false,
            statuscode: 400,
            message: "user Deletion Failed",
        }
        res.status(response.statuscode).send(response);
    }
}