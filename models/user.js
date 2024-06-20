const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
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