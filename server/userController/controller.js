let users = require('../db/model/model');
let userTypes = require('../db/model/userTypes')
const { success_function, error_function } = require('../utils/responsehandler');
const bcrypt = require('bcrypt')
const userType = require('../db/model/userTypes')
const fileUpload = require('../utils/file-upload').fileUpload;
const fileDelete = require('../utils/file-delete').fileDelete;
const path = require('path');
const set_password_template =require("../utils/email-templates/set-password").resetPassword;
const sendEmail = require("../utils/send-email").sendEmail;
  
exports.Adduser = async function (req, res) {
    try {
        const { name, email, joiningdate, userType, password, image } = req.body;
        console.log("body: ", req.body);

        // Generate a random password if one is not provided
        function generateRandomPassword(length = 10) {
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return Array.from({ length }, () => charset.charAt(Math.floor(Math.random() * charset.length))).join('');
        }

        const randomPassword = password || generateRandomPassword();
        console.log("Generated password: ", randomPassword);

        // Set up email template and send email
        // const email_template = await set_password_template(name, email, randomPassword);
        // await sendEmail(email, "User created", email_template);

        // Hash the password
        const hashedPassword = bcrypt.hashSync(randomPassword, bcrypt.genSaltSync(10));
        console.log("Hashed password: ", hashedPassword);

        // Handle image upload if provided
        let imagePath;
        if (image) {
            imagePath = await fileUpload(image, "Users");
            console.log("Uploaded image path: ", imagePath);
        }

        const newUser = {
            email,
            name,
            joiningdate,
            image: imagePath,
            userType,
            password: hashedPassword
        };

        // Check if the user already exists
        const existingUserCount = await users.countDocuments({ email });
        if (existingUserCount > 0) {
            return res.status(400).send(error_function({
                success: false,
                statuscode: 400,
                message: "User already exists with this email",
            }));
        }

        // Create the new user
        const addedUser = await users.create(newUser);
        console.log("User added: ", addedUser);

        return res.status(200).send(success_function({
            success: true,
            statuscode: 200,
            message: "User added successfully",
            data: addedUser,
        }));

    } catch (error) {
        console.error("Error during user addition: ", error);
        return res.status(400).send(error_function({
            success: false,
            statuscode: 400,
            message: "User not added: " + error.message,
        }));
    }
};



exports.GetAlluser = async function (req, res) {
    try {
        const findUser = await users.find({ userType: { $eq: "Employee" } });
        console.log("findUser: ", findUser);

        const response = success_function({
            success: true,
            statuscode: 200,
            message: "Users fetched successfully",
            data: findUser, // Use findUser here
        });
        // Send the response
        res.status(response.statuscode).send(response);
        return;
    } catch (error) {
        console.error("Error: ", error);
        let response = error_function({
            success: false,
            statuscode: 400,
            message: "Users not getted",
        });
        res.status(response.statuscode).send(response);
        return;
    }
};


exports.GetSingleuser = async function (req, res) {
    try {

        if(req.params.id){
            id = req.params.id;
            console.log("id : ", id);
    
            let single_user = await users.find({ _id: id });
    
            let response = success_function({
                success: true,
                statuscode: 200,
                message: "single user getted",
                data: single_user
            });
            res.status(response.statuscode).send(response);
            return;
        }else{
            let response = error_function({
                success: false,
                statuscode: 400,
                message: "id not getting"
            });
            res.status(response.statuscode).send(response);
            return;
        }
        
    } catch (error) {

        let response = error_function({
            success: false,
            statuscode: 400,
            message: "single user not getted",
            // data: single_user
        });
        res.status(response.statuscode).send(response);
        return;
    }

}

exports.edituser = async function (req, res) {
    try {
        const body = req.body;
        const _id = req.params.id;

        if (!body) {
            let response = error_function({
                success: false,
                statuscode: 400,
                message: "Body not Found",
            });
            return res.status(response.statuscode).send(response);
        }

        console.log("Request body:", body);
        console.log("User ID:", _id);

        // Hash password if provided
        if (body.password) {
            const salt = bcrypt.genSaltSync(10);
            body.password = bcrypt.hashSync(body.password, salt);
            console.log("Password hashed successfully.");
        }

        const existingUser = await users.findOne({ _id });
        if (!existingUser) {
            let response = error_function({
                success: false,
                statuscode: 404, // Use 404 for not found
                message: "User not Found",
            });
            return res.status(response.statuscode).send(response);
        }

        let splittedImg;
        
        // Handle image upload if provided
        if (body.image) {
            // If the user has an existing image, get its path segment for deletion
            if (existingUser.image) {
                splittedImg = existingUser.image.split('/')[2];
                console.log("Existing image path segment:", splittedImg);
            }

            // Upload the new image
            const img_path = await fileUpload(body.image, "Users");
            body.image = img_path;
            console.log("New image path:", img_path);
        }

        // Update user in the database
        const updateUser = await users.updateOne({ _id }, { $set: body });
        console.log("Update result:", updateUser);

        // Delete old image if it exists
        if (splittedImg) {
            const imagePathToDelete = path.join('./uploads', 'Users', splittedImg);
            await fileDelete(imagePathToDelete);
            console.log("Old image deleted:", imagePathToDelete);
        }

        let response = success_function({
            success: true,
            statuscode: 200,
            message: "User updated successfully", // Changed message
            data: updateUser, // Include updated user data
        });
        return res.status(response.statuscode).send(response);

    } catch (error) {
        console.error("Error during user update:", error);
        let response = error_function({
            success: false,
            statuscode: 500, // Use 500 for server errors
            message: "User Updation Failed",
        });
        return res.status(response.statuscode).send(response);
    }
};

exports.Deleteuser = async function (req, res) {
    try {
        let _id = req.params.id;
        console.log("_id: ", _id);

        // Find the existing user
        const existingUser = await users.findOne({ _id });
        if (!existingUser) {
            let response = error_function({
                success: false,
                statuscode: 404,
                message: "User not found",
            });
            return res.status(response.statuscode).send(response);
        }

        let splittedImg;
        if (existingUser.image) {
            splittedImg = existingUser.image.split('/')[2];
            console.log("Existing image path segment:", splittedImg);
        }

        // Delete the user
        const deleteResult = await users.deleteOne({ _id });
        console.log("Delete result: ", deleteResult);

        if (deleteResult.deletedCount > 0) {
            // If a user was deleted, delete the associated image if it exists
            if (splittedImg) {
                const imagePathToDelete = path.join('./uploads', 'Users', splittedImg);
                await fileDelete(imagePathToDelete);
                console.log("Old image deleted:", imagePathToDelete);
            }

            let response = success_function({
                success: true,
                statuscode: 200,
                message: "User deleted successfully",
            });
            return res.status(response.statuscode).send(response);
        } else {
            let response = error_function({
                success: false,
                statuscode: 400,
                message: "User deletion failed",
            });
            return res.status(response.statuscode).send(response);
        }

    } catch (error) {
        console.error("Error during user deletion:", error);
        let response = error_function({
            success: false,
            statuscode: 400,
            message: "User deletion failed",
        });
        return res.status(response.statuscode).send(response);
    }
};
