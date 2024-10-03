const { error_function, success_function } = require("./responsehandler");
const users = require('../db/model/model');
const jwt = require('jsonwebtoken');

exports.checkLogin = async function (req, res, next) {

    let authorization = req.headers['authorization'];
    console.log("authorization : ",authorization);

    let token = authorization.split(' ')[1];
    console.log("token : ",token);

    if(token == '' || token == "undefined" || token == "null" || token == null || token == undefined) {

        let response = error_function({
            statusCode : 400,
            message : "token undifined"
        });

        res.status(response.statuscode).send(response);
        return;

    }else{

        jwt.verify(token, process.env.PRIVATE_KEY, async function (err, decode) {

            if(err) {

                let response = error_function({
                    statusCode : 400,
                    message : "error verifying token"
                });
        
                res.status(response.statuscode).send(response);
                return;
                
            }else{

                console.log("decode : ",decode);

                let user_id = decode.user_id;
                console.log("user_id : ",user_id);

                let user = await users.findOne({_id : user_id});

                if(user) {
                    next();
                }else {

                    let response = error_function({
                        statusCode : 400,
                        message : "user not found"
                    });
            
                    res.status(response.statuscode).send(response);
                    return;
                    
                }

            }

        })

    }

}