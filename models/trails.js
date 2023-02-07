const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//mongoose.set('strictQuery', true);

const TrailsSchema = new Schema({
    title: String,
    description: String,
    location: String,
    trailType: String
});

module.exports = mongoose.model('Trails', TrailsSchema);