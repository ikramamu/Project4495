const mongoose = require('mongoose');
const Trails = require('../models/trails');
const locations = require('./locations');
const {places, trailType} = require('./seedHelpers');


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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Trails.deleteMany({});
    for(let i= 0;i < 10 ; i++){
        const rand6 = Math.floor(Math.random() * 6 );
        const trail = new Trails({
            location: `${locations[rand6].city},${locations[rand6].state}`,
            title: `${sample(trailType)} ${sample(places)}`,
            description: 'this anything',
            image:'https://source.unsplash.com/collection/928423/1200x720'

        })
        await trail.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});