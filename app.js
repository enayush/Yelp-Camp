if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express')
const mongoose = require('mongoose')
const path  = require('path')
const app = express();
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const session = require('express-session')
const ExpressError = require('./Utils/ExpressError')
const campgroundsRouter = require('./routes/campgrounds.js')
const reviewsRouter = require('./routes/reviews.js')
const flash = require('connect-flash')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')
const userRouter = require('./routes/user.js');
const DBurl = process.env.DB_Url;
const MongoStore = require('connect-mongo');
//mongodb://127.0.0.1:27017/yelpCamp
mongoose.connect(DBurl)
    .then(console.log('connected'))
    .catch(error => handleError(error));

app.engine('ejs',ejsMate)
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')))
app.use(flash())

const secret = process.env.SECRET

const store = MongoStore.create({
    mongoUrl: DBurl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

const sessionConfig={
    store,
    secret ,
    resave : false,
    saveUninitialized : true,
    cookie :{
        httpOnly : true,
        expires : Date.now() + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    // console.log(req.session)
    res.locals.currentUser = req.user; //user Helper function from Passport
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

app.use('/',userRouter);
app.use('/campgrounds',campgroundsRouter);
app.use('/campgrounds/:id/reviews',reviewsRouter);

app.get('/', (req, res) => {
    res.render('home')
});

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next)=>{
    if(!err.message) err.message = 'Oh no! Something went wrong'
    if(!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).render('error',{err})
})

const port = process.env.PORT

app.listen(port,()=>{
    console.log(`listening at ${port}`);
})
