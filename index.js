if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const session = require('express-session');
const MongoStore = require('connect-mongo');

// 'mongodb://127.0.0.1:27017/rrecipe'
mongoose.connect(process.env.DB_URL).then(() => {
    console.log('Mongo Connection Successful!');
}).catch(err => {
    console.error('Mongo Connection Error:', err);
});

const store = MongoStore.create({
    mongoUrl: process.env.DB_URL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.ST_SCRT
    }
});

const sessionConfig = {
    secret: process.env.SS_SCRT,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

const User = require('./models/user.js');

// routes
const recipeRoutes = require('./routes/recipes.js');
const loginRoutes = require('./routes/logins.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(flash());
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Store current user and our flashes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.failure = req.flash('failure');
    next();
});

// routes
app.use('/', loginRoutes);
app.use('/recipes', recipeRoutes);

app.use((req, res) => {
    res.status(404).send('No page found!');
});


// Error Handler
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something Went Wrong' } = err;
    res.status(status).send(message);
});

const port = process.env.PORT || 3000
// Start Server
app.listen(port, () => {
    console.log('Started server on port 3000');
});

module.exports = app;