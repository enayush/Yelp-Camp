const User = require('../models/user')

module.exports.renderForm = (req,res)=>{
    res.render('users/register')
}

module.exports.register = async (req,res)=>{
    try{
        const {username , email, password} = req.body;
        const user = await new User({username,email});
        const newUser = await User.register(user,password);
        req.login(newUser , (err)=>{
            if(err) return next(err);
            req.flash('success','Welcome to YelpCamp');
            res.redirect('/campgrounds')
        })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register')
    }
    
}

module.exports.renderLogin = (req,res)=>{
    res.render('users/login')
}

module.exports.userLogin = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.userLogout = (req, res, next) => {
    req.logout(function (err) {
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}