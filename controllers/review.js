const Review = require('../models/reviews.js')
const Campground = require('../models/campgrounds')

module.exports.createReview = async(req,res)=>{
    const campgrounds = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campgrounds.reviews.push(review);
    await campgrounds.save();
    await review.save();
    req.flash('success','Created new Review!!')
    res.redirect(`/campgrounds/${req.params.id}`)

}

module.exports.deleteReview = async(req,res)=>{
    const {id , reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull : { reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully Deleted Review!')
    res.redirect(`/campgrounds/${id}`);
}