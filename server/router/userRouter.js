const express = require("express")
const router = express.Router();
const userController = require('../userController/controller');
const login = require("../userController/authController").login
const checklogin = require('../utils/checklogin').checkLogin

router.post('/submit',userController.Adduser);
router.get('/submit',checklogin,userController.Getuser);

module.exports = router