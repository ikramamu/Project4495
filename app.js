const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const wrapAsync = require('./utils/wrapAsync')
const ExpressError = require('./utils/ExpressError')
const joi = require('joi')
const Trails = require('./models/trails');
const { application } = require('express');



mongoose.connect('mongodb://127.0.0.1:27017/finalProject', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// mongoose.connect('mongodb://localhost:27017/trailBlazer', {
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// });

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

app.get('/', (req, res)=> {
    res.render('Home');
})

app.get('/trails', wrapAsync(async (req, res)=> {
    const trails = await Trails.find({});
    res.render('trails/index', {trails});
}))

app.get('/trails/new', wrapAsync(async (req, res)=> {
    //const trail = await Trails.findById(req.params.id)
    res.render('trails/new');
}))
app.post('/trails', wrapAsync(async (req, res, next) => {
    //if(!req.body.trail) throw new ExpressError('Invalid Data', 400)
    const trailSchema = joi.object({
        trail: joi.object({
            title: joi.string().required(),
            location: joi.string().required(),
            image: joi.string().required(),
            description:joi.string().required(),
            difficultyLevel: joi.string().required(),
            trailLength: joi.number().required().min(0),
            fitnessLevel:joi.string().required()
        }).required()
    })
    const { error } = trailSchema.validate(req.body);
    if(error){
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400)
    }
    const trail = new Trails(req.body.trail);
    await trail.save();
    res.redirect(`/trails/${trail._id}`);
   
}))

app.get('/trails/:id', wrapAsync(async (req, res)=> {
    const trail = await Trails.findById(req.params.id)
    res.render('trails/show',{trail});
}))

app.get('/trails/:id/edit', wrapAsync(async (req, res) =>{
    const trail = await Trails.findById(req.params.id)
    res.render('trails/edit', {trail});
}))

app.put('/trails/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const trail = await Trails.findByIdAndUpdate(id, {...req.body.trail });
    res.redirect(`/trails/${trail._id}`);
}))

app.delete('/trails/:id', wrapAsync(async(req, res)=>{
    const { id }=req.params;
    await Trails.findByIdAndDelete(id);
    res.redirect('/trails');
}))

app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404))
})

// Handling Error
app.use((err, req, res, next)=>{
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'OOPS!! Something went wrong!'
    res.status(statusCode).render('error', { err })
})


// app.get('/maketrail', async (req,res) => {
//     const trail = new Trails({title: 'BC Mountains',description: 'Best camps', location: 'Tofino', trailType: 'difficult'});
//     await trail.save();
//     res.send(trail)
// })

app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})