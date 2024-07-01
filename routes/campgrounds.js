const express = require('express');
const router = express.Router()
const campgController = require('../controllers/campground.js')
const catchAsync = require('../Utils/catchAsync')
const {storage } = require('../cloudinary/index.js')
const multer  = require('multer')
const upload = multer({ storage})

const Campground = require('../models/campgrounds')
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware.js');

router.route('/')
    .get(catchAsync(campgController.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgController.create))

router.get('/new',isLoggedIn, campgController.new)

router.route('/:id')
    .get(catchAsync(campgController.showCampground))
    .put(isLoggedIn ,isAuthor, upload.array('image'),validateCampground,catchAsync(campgController.editCampground))
    .delete(isLoggedIn ,isAuthor, catchAsync(campgController.deleteCampground))

router.get('/:id/edit', isLoggedIn,isAuthor,catchAsync(campgController.renderEditForm))





module.exports = router;