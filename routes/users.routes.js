const express = require('express')
const UserController = require('../controllers/users') 
const router = express.Router()

//User Signup

router.post('/signup', UserController.user_signup)

//User Login

router.post('/login', UserController.user_login)

module.exports = router