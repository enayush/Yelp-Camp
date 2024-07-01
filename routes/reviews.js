const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../Utils/catchAsync')
const Review = require('../models/reviews.js')
const Campground = require('../models/campgrounds')
const {validateReview,isLoggedIn, isReviewAuthor} = require('../middleware.js')
const reviewController = require('../controllers/review.js')



router.post('/', isLoggedIn,validateReview,catchAsync(reviewController.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviewController.deleteReview))

module.exports = router;