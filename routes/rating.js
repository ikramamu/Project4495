const express = require('express');
const router = express.Router({ mergeParams: true});
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const joi = require('joi')
const Trails = require('../models/trails');
const { application } = require('express');
const Rating = require('../models/ratings');
const {isLoggedIn, verifyAuthor } = require('../middleware')

const trails = require('../routes/trail')
const ratings = require('../routes/rating')


router.post('/', isLoggedIn, wrapAsync(async(req, res)=>{
    const trail = await Trails.findById(req.params.id);
    const rating = new Rating(req.body.rating);
    rating.author = req.user._id;
    trail.ratings.push(rating);
    await rating.save();
    await trail.save();
    res.redirect(`/trails/${trail._id}`);
}))
router.delete('/:ratingsId', isLoggedIn, wrapAsync(async(req, res)=>{
    const {id, ratingsId } = req.params;
    await Trails.findByIdAndUpdate(id, {$pull: {ratings: ratingsId}});
    await Rating.findByIdAndDelete(req.params.ratingsId);
    res.redirect(`/trails/${id}`);
}))

module.exports = router;