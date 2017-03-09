var passport = require("passport");

var LocalStrategy  = require("passport-local").Strategy;

var express = require('express');

var router = express.Router();
var User = require('../modles/user');
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {
                    message: 'unknown username.'
                });
            }
            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);

                } else {
                    return done(null, false, {
                        message: 'invalid'
                    })
                }
            })


        })
    }));

router.get('/register', function(req, res) {
    res.render('register');

})

router.get('/login', function(req, res) {
    res.render('login');
})

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success_msg','you are logout');

    res.redirect('login');
})





router.post('/login',passport.authenticate('local', 
    {  

        successRedirect: '/',failureRedirect: 'login',failureFlash: true,
        function(req, res) {
            console.log(res);
            res.redirect('register');
        }
    }
))

router.post('/register', function(req, res) {
    console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    req.checkBody('username', 'Name is required').notEmpty();
    var er = req.validationErrors();
    if (er) {
        res.render('register', {
            'errors': er
        });
    } else {
        var newUser = User({
            username: username,
            email: email,
            password: password
        })
        User.createUser(newUser, function(err, User) {
            if (err) throw err;
            console.log(User);
        })
        req.flash('success_msg', 'you are registered and can login');
        res.redirect('login');
    }
});






module.exports = router;