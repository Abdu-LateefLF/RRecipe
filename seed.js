const mongoose = require('mongoose');
const Recipe = require('./models/recipe.js');
const recipes = require('./recipeSeed.json');
const User = require('./models/user');
const AppError = require('./AppError.js')

module.exports.seedDatabase = async function (req, res, next) {
    try {
        for (let rec of recipes) {
            const recipe = new Recipe({ ...rec });

            await recipe.save();
            req.user.recipes.push(recipe);
        }

        await req.user.save();

        next();

    } catch (e) {
        return next(new AppError(e.message));
    }
}