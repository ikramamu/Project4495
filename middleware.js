const Trails = require('./models/trails');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.verifyAuthor = async(req, res, next)=>{
    const {id} = req.params;
    const trail = await Trails.findById(id);
    if(!trail.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/trails/${id}`);
    }
    next();
}