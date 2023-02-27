const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ratingsSchema = new Schema({
    comment: String,
    rating: Number
});

module.exports = mongoose.model('Rating', ratingsSchema);