const mongoose = require('mongoose');
const wrapAsync = require('../utils/wrapAsync');
const Rating = require('./ratings')
const Schema = mongoose.Schema;

const TrailsSchema = new Schema({
    title: String,
    images: [
        {
        url: String,
        fileName: String
        }
    ],
    geometry:{
        type:{
            type: String,
            enum:['Point'],
            required: true
        },
        coordinates: {
            type:[Number],
            required: true
        }
    },
    description: String,
    location: String,
    difficultyLevel: String,
    trailLength: Number,
    fitnessLevel: String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ratings:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Rating'
        }
    ]

});

TrailsSchema.virtual('properties.popUpMarkup').get(function(){
    return "HEYYYYYY";
})

// To remove ratings when the trail is deleted
TrailsSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Rating.deleteMany({
            _id:{
                $in: doc.ratings
            }
        })
    }
    console.log(doc)
})

module.exports = mongoose.model('Trails', TrailsSchema);