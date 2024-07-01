const joi = require('joi');

module.exports.campgroundSchema =joi.object({
    campgrounds : joi.object({
        title : joi.string().required(),
        price : joi.number().min(0).required(),
        location : joi.string().required(),
        // image : joi.string().required(),
        description : joi.string().required()
    }).required(),
    deleteImages: joi.array()
});

module.exports.reviewSchema =joi.object({
    review : joi.object({
        rating : joi.number().required().min(1).max(5),
        body : joi.string().required()
    }).required()
});