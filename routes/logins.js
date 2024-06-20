const express = require('express');
const router = express.Router();
const passport = require('passport');

const AppError = require('../AppError.js');
const User = require('../models/user.js');

// Home route
router.get('/', (req, res) => {
    res.render('home')
});

router.get('/login', (req, res) => {
    res.render('login')
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    console.log('Successful Login!')
    res.redirect('/recipes')
});

router.get('/register', async (req, res) => {
    res.render('register')
});

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, username, password } = req.body;

        const user = new User({ firstName, lastName, username });
        const registeredUser = await User.register(user, password);

        // Try to login the user
        req.login(registeredUser, async (err) => {
            if (err) {
                res.redirect('/');
            } else {
                res.redirect('/recipes');
            }
        });
    } catch (e) {
        console.log(e);
        req.flash('failure', e.message);
        res.redirect('/register');
    }
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        console.log('Logout Successful');
    });
    res.redirect('/');
})

module.exports = router;