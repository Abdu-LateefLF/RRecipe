const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
const { required } = require('joi');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxLength: 30,
        required: true
    },
    lastName: {
        type: String,
        maxLength: 30,
        required: true
    },
    username: {
        type: String,
        maxLength: 30,
        required: true
    },
    password: {
        type: String,
    },
    recipes: [
        { type: mongoose.SchemaTypes.ObjectId, ref: 'recipe' }
    ]
});

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('user', userSchema);

module.exports = User;