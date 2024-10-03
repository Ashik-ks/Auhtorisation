const express = require("express")
const router = express.Router();
const userController = require('../userController/controller');
const login = require("../userController/authController").login
const accessControl = require("../utils/access-control").accessControl

function setAccessControl(access_types) {

    return(req,res,next) => {
        accessControl(access_types,req,res,next);
    }
}

router.post('/users',setAccessControl("1"),userController.Adduser);
router.get('/users',setAccessControl("2"),userController.GetAlluser);
router.get('/users/:id',setAccessControl("*"),userController.GetSingleuser);


module.exports = router