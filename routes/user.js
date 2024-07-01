const express = require('express');
const router = express.Router();
const User = require('../models/user')
const catchAsync = require('../Utils/catchAsync');
const passport = require('passport');
const {storeReturnTo} = require('../middleware');
const userController = require('../controllers/user');
const { render } = require('ejs');

router.route('/register')
    .get(userController.renderForm)
    .post(catchAsync(userController.register))

router.route('/login')
    .get(userController.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', 
            { failureFlash: true, failureRedirect: '/login' }),
            userController.userLogin);

router.get('/logout', userController.userLogout); 

module.exports = router;