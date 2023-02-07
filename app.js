const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
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

app.get('/', (req, res)=> {
    res.render('Home')
})
app.get('/maketrail', async (req,res) => {
    const trail = new Trails({title: 'BC Mountains',description: 'Best camps',location: 'Delhi', trailType: 'dificult'});
    await trail.save();
    res.send(trail)
})

app.listen(3000, ()=>{
    console.log('Serving on port 3000')
})