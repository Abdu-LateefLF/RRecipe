const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    preparationTime: {
        type: Number,
        min: 0,
        required: true
    },
    ingredients: [
        { type: String }
    ],
    image: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    briefDescription: {
        type: String,
        required: true
    }
});

const Recipe = mongoose.model('recipe', recipeSchema);

module.exports = Recipe;