const success_function = require('../utils/responsehandler').success_function;
const error_function = require('../utils/responsehandler').error_function;
const users = require('../db/model/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


exports.login = async function (req, res) {
    try {

        let email = req.body.email;
        console.log("email : ", email);

        let password = req.body.password;
        console.log("password : ", password);

        //Validations

        let user = await users.findOne({ email }).populate("userType");
        console.log("user : ", user);
        console.log("user_types.userType.userType : ", user.userType.userType)

        if (user) {

            let db_password = user.password;
            console.log("db_password : ", db_password);

            let passwordMatch = bcrypt.compareSync(password, db_password);
            console.log("passwordMatch : ", passwordMatch);

            if (passwordMatch) {

                let token = jwt.sign({ user_id: user._id }, process.env.PRIVATE_KEY, { expiresIn: "10d" });
                console.log("token : ", token);

                let token_id = user._id;
                console.log("token_id : ", token_id);

                user.loginCount = (user.loginCount || 0) + 1; // Default to 0 if undefined
                await user.save();

                response_data = {
                    token,
                    user_types: user.userType.userType,
                    token_id: token_id,
                    loginCount:user.loginCount
                }
                console.log("response_data : ", response_data)

                let response = success_function({
                    statusCode: 200,
                    data: response_data,
                    message: "Login successful",
                });

                res.status(response.statuscode).send(response);
                return;
            } else {

                let response = error_function({
                    statusCode: 400,
                    message: "Invalid password",
                });

                res.status(response.statuscode).send(response);
                return;
            }

        } else {
            let response = error_function({
                statusCode: 404,
                message: "User not found",
            });

            res.status(response.statuscode).send(response);
            return;
        }

    } catch (error) {

        console.log("error : ", error);

        let response = error_function({
            statusCode: 400,
            message: error.message ? error.message : "Something went wrong",
        });

        res.status(response.statuscode).send(response);
        return;
    }
}

exports.passwordreset = async function (req, res) {
    try {

        
        // let email = req.body.email;
        // console.log("email : ", email);

        let _id = req.params.id;
        console.log("_id")
        let user = await users.findOne({ _id });

        if (!user) {
            return res.status(404).send({
                success: false,
                statuscode: 404,
                message: "User not found",
            });
        }

        console.log("user : ", user);

        if (user) {
            // Compare the provided password with the hashed password
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        console.log("passwordmatch : ", passwordMatch);

        if (passwordMatch) {
            // Hash the new password
            const hashedNewPassword = await bcrypt.hash(req.body.newpassword, 10);
            console.log("hashednewpassword : ", hashedNewPassword);

            // Update the user with the new password
            let updateUser = await users.updateOne({ _id }, { $set: { password: hashedNewPassword } });
            console.log("Update_user : ", updateUser);

            let response = {
                success: true,
                statuscode: 200,
                message: "User updated successfully",
                data: updateUser,
            };

            return res.status(response.statuscode).send(response);
        } else {
            return res.status(400).send({
                success: false,
                statuscode: 400,
                message: "Invalid password",
            });
        }
        }

        
    } catch (error) {
        console.log("error : ", error);
        let response = {
            success: false,
            statuscode: 500,
            message: "User updation failed",
        };
        res.status(response.statuscode).send(response);
    }
};
