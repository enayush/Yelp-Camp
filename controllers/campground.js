const Campground = require('../models/campgrounds')
const { cloudinary } = require("../cloudinary/index");

module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}

module.exports.new = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.create = async(req,res,next)=>{
    const newCampground = new Campground(req.body.campgrounds)
    newCampground.image = req.files.map(f =>({url : f.path , filename : f.filename}))
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success','Successfully created a Campground!')
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async (req,res)=>{
    const campgrounds = await Campground.findById(req.params.id).populate({
        path :'reviews',
            populate:{
            path: 'author'
            }   
        }).populate('author');
    if(!campgrounds){
        req.flash('error','Cannot find that campground')
        res.redirect('/campgrounds');
    }
    else res.render('campgrounds/show',{campgrounds});
}

module.exports.renderEditForm =async (req,res)=>{
    const campgrounds = await Campground.findById(req.params.id);
    if(!campgrounds){
        req.flash('error','Cannot find that campground')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campgrounds});
}

module.exports.editCampground = async (req,res)=>{
    const newCampground = await Campground.findByIdAndUpdate(req.params.id,req.body.campgrounds);
    const img =  req.files.map(f =>({url : f.path , filename : f.filename}))
    newCampground.image.push(...img);
    await newCampground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await newCampground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully Updated Campground!')
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.deleteCampground = async (req,res)=>{
    const newCampground = await Campground.findByIdAndDelete(req.params.id);
    req.flash('success','Successfully Deleted Campground!')
    res.redirect(`/campgrounds`);
}