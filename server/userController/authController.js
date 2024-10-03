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

        let user = await users.findOne({ email });
        console.log("user : ", user);

        if (user) {

            let db_password = user.password;
            console.log("db_password : ", db_password);

            let passwordMatch = bcrypt.compareSync(password, db_password);
            console.log("passwordMatch : ", passwordMatch);

            if (passwordMatch) {

                let token = jwt.sign({ user_id: user._id }, process.env.PRIVATE_KEY, { expiresIn: "10d" });
                console.log("token : ", token);

                let response = success_function({
                    statusCode: 200,
                    data: token,
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