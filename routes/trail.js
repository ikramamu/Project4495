const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const trailCOntroller = require('../controllers/trails')
const ExpressError = require('../utils/ExpressError');
const joi = require('joi');
const Trails = require('../models/trails');
const {isLoggedIn, verifyAuthor } = require('../middleware')

const mapboxClient = require('@mapbox/mapbox-sdk/services/geocoding');
const accessToken = 'pk.eyJ1IjoibWlrcmFtMDQiLCJhIjoiY2xnOXRhdjU5MGJyajNkcHRpYWx1MndubCJ9.i6djtQASXdM4AMvN48DMLA';
const geocodingService = mapboxClient({ accessToken: accessToken });

const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });


router.get('/', wrapAsync(trailCOntroller.index));

router.get('/new', isLoggedIn, trailCOntroller.newTrail);

router.post('/', isLoggedIn, upload.array('image'), wrapAsync(async (req, res, next) => {
    const trailSchema = joi.object({
        trail: joi.object({
            title: joi.string().required(),
            location: joi.string().required(),
            //image: joi.string().required(),
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
    const geoData = await geocodingService.forwardGeocode({
        query: req.body.trail.location,
        limit: 1
      }).send()
    const trail = new Trails(req.body.trail);
    trail.images = req.files.map(f=>({url: f.path, fileName: f.filename}))
    trail.geometry = geoData.body.features[0].geometry;
    trail.author = req.user._id;
    await trail.save();
    req.flash('success', 'New trail added successfully!');
    res.redirect(`/trails/${trail._id}`);
   
}))

router.get('/:id', wrapAsync(async (req, res)=> {
    const trail = await Trails.findById(req.params.id).populate({
        path:'ratings',
        populate:{
            path: 'author'
        }
    }).populate('author');
    console.log(trail);
    if(!trail){
        req.flash('error', 'Cannot find that trail!');
        return res.redirect('/trails')
    }
    res.render('trails/show',{ trail });
}))

router.get('/:id/edit', isLoggedIn , verifyAuthor, wrapAsync(async (req, res) =>{
    const trail = await Trails.findById(req.params.id)
    res.render('trails/edit', {trail});
}))

router.put('/:id', isLoggedIn, verifyAuthor, upload.array('image'), wrapAsync(async (req, res) => {
    const { id } = req.params;
    const trail = await Trails.findById(id);
    if(!trail.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/trails/${id}`);
    }
    const trails = await Trails.findByIdAndUpdate(id, {...req.body.trail });
    const images = req.files.map(f=>({url: f.path, fileName: f.filename}));
    trail.images.push(...images);
    await trail.save();
    req.flash('success', 'Successfully updated!');
    res.redirect(`/trails/${trails._id}`);
}))

router.delete('/:id', isLoggedIn, verifyAuthor, wrapAsync(async(req, res)=>{
    const { id }=req.params;
    const trail = await Trails.findById(id);
    if(!trail.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/trails/${id}`);
    }
    await Trails.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted!');
    res.redirect('/trails');
}))

module.exports = router;