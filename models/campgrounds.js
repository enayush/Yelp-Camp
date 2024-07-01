const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews')


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
const campgroundSchema = new Schema({
    title : String,
    image :[ImageSchema],
    price : Number,
    description : String,
    location : String,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    reviews :[{
        type : Schema.Types.ObjectId,
        ref : 'Review'
    }]
})

//mongoose middlewares
campgroundSchema.post('findOneAndDelete', async function(doc){
     if(doc){
        await Review.deleteMany({
            _id :{
                $in : doc.reviews
            }
        })
     }
})

module.exports = mongoose.model('Campground',campgroundSchema);