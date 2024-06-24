const express = require('express');
const router = express.Router();
const passport = require('passport');
const Joi = require('joi');

const AppError = require('../AppError.js');
const User = require('../models/user.js');

// Create a schema that we can use to test user inputs
const userSchema = Joi.object({
    firstName: Joi.string().required().max(30),
    lastName: Joi.string().required().max(30),
    username: Joi.string().required().max(30),
    password: Joi.string().required().max(50)
});

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
    const { error } = userSchema.validate(req.body);

    try {
        // Ensure that all fields were entered correctly
        if (error) {
            const msg = error.details.map(el => el.message).join(',');
            throw new AppError(msg, 400);
        }

        const { firstName, lastName, username, password } = req.body;

        const user = new User({ firstName, lastName, username });
        const registeredUser = await User.register(user, password);

        // Try to login the user
        req.login(registeredUser, async (err) => {
            if (err) {
                res.redirect('/');
            } else {
                req.flash('success', 'Your Account Was Successfully Created!');
                res.redirect('/recipes');
            }
        });
    } catch (e) {
        req.flash('failure', e.message);
        res.redirect('/register');
    }
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
})

module.exports = router;