const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');

router.get('/register', (req, res)=>{
    res.render('users/register')
});

router.post('/register', wrapAsync(async(req, res)=>{
    try {

    
    const {email, username, password }=req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err =>{
        if(err) return next(err);
        req.flash('success', 'Welocme to Trail Blazer');
        res.redirect('/trails');
    })
    } catch(e){
        req.flash('error', e.message);
        res.redirect('register')
    }   
}));

router.get('/login', (req, res)=>{
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res)=>{
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/trails';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', function(req, res){
    req.logout(function(err){
      if(err) return next(err);
      req.flash('success', 'Goodbye!');
      res.redirect('/trails');
    });
  });

module.exports = router;