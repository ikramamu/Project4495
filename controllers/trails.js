const Trails = require('../models/trails');

module.exports.index = async (req, res)=> {
    const trails = await Trails.find({});
    res.render('trails/index', {trails});
}

module.exports.newTrail = ( req, res)=> {
    res.render('trails/new');
}