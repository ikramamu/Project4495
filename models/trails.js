const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//mongoose.set('strictQuery', true);

const TrailsSchema = new Schema({
    title: String,
    image: String,
    description: String,
    location: String,
    difficultyLevel: String,
    trailLength: Number,
    fitnessLevel: String,
    ratings:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Rating'
        }
    ]

});

module.exports = mongoose.model('Trails', TrailsSchema);