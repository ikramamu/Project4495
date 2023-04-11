if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

console.log(process.env.MAPBOX_TOKEN)
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')

const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')


const session = require('express-session');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const joi = require('joi');
const Trails = require('./models/trails');
const { application } = require('express');
const Rating = require('./models/ratings');

const trails = require('./routes/trail')
const ratings = require('./routes/rating')
const userRoutes = require('./routes/users');


const db_connector = process.env.DB_ATLAS;
//'mongodb://127.0.0.1:27017/finalProject'
mongoose.connect(db_connector, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database connection successfull");
})


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

//setting up cookies and sessions
const sessionConfig = {
    secret: 'ThisisImportant',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60* 24* 7,
        maxAge: 1000 * 60 * 60* 24* 7
    }
}
app.use(session(sessionConfig))

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/trails', trails);
app.use('/trails/:id/ratings', ratings);

app.use('/', userRoutes);


app.get('/', (req, res)=> {
    res.render('Home');
})

app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404))
})

// Handling Error
app.use((err, req, res, next)=>{
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'OOPS!! Something went wrong!'
    res.status(statusCode).render('error', { err })
})
app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})