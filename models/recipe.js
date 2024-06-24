const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: 40,
        required: true
    },
    preparationTime: {
        type: Number,
        min: 0,
        required: true
    },
    ingredients: [
        { type: String, maxLength: 50 }
    ],
    image: {
        type: String,
        maxLength: 500,
        required: true
    },
    instructions: {
        type: String,
        maxLength: 5000,
        required: true
    },
    briefDescription: {
        type: String,
        maxLength: 5000,
        required: true
    }
});

const Recipe = mongoose.model('recipe', recipeSchema);

module.exports = Recipe;