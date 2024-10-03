const success_function = require("../utils/responsehandler").success_function
const error_function = require("../utils/responsehandler").error_function

exports.accessControl = async function (access_types,req,res,next) {
    try {
        console.log("access_types : ",access_types)
    } catch (error) {
        console.log("error : ",error);


        let response = error_function({
            statusCode: 400,
            message: "Invalid password",
        });

        res.status(response.statuscode).send(response);
        return;
    }
} 
