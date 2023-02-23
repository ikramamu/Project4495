const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Trails = require('./models/trails');



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



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))

app.use(methodOverride('_method'));

app.get('/', (req, res)=> {
    res.render('Home')
})
app.get('/trails', async (req, res)=> {
    const trails = await Trails.find({});
    res.render('trails/index', {trails})
})
app.get('/trails/new', async (req, res)=> {
    //const trail = await Trails.findById(req.params.id)
    res.render('trails/new');
})
app.post('/trails', async (req, res) => {
    const trail = new Trails(req.body.trail);
    await trail.save();
    res.redirect(`/trails/${trail._id}`)
})

app.get('/trails/:id', async (req, res)=> {
    const trail = await Trails.findById(req.params.id)
    res.render('trails/show',{trail});
})

app.get('/trails/:id/edit', async (req, res) =>{
    const trail = await Trails.findById(req.params.id)
    res.render('trails/edit', {trail})
})

app.put('/trails/:id', async (req, res) => {
    const { id } = req.params;
    const trail = await Trails.findByIdAndUpdate(id, {...req.body.trail });
    res.redirect(`/trails/${trail._id}`)
});

app.delete('/trails/:id', async(req, res)=>{
    const { id }=req.params;
    await Trails.findByIdAndDelete(id);
    res.redirect('/trails');
})


// app.get('/maketrail', async (req,res) => {
//     const trail = new Trails({title: 'BC Mountains',description: 'Best camps', location: 'Tofino', trailType: 'difficult'});
//     await trail.save();
//     res.send(trail)
// })

app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})