const express = require('express');
const router = express.Router();
const Joi = require('joi');

const Recipe = require('../models/recipe.js');
const AppError = require('../AppError.js');
const { isLoggedIn } = require('../Utils.js');

// Create a schema that we can use to test user inputs
const recipeSchema = Joi.object({
    name: Joi.string().required().max(40),
    preparationTime: Joi.number().required().min(0),
    ingredients: Joi.array().required().min(1).items(Joi.string().max(50)),
    image: Joi.string().required().max(500),
    instructions: Joi.string().required().max(5000),
    briefDescription: Joi.string().required().max(5000)
});

// Shortens a paragraph if its character count is greater than the max specified
const shorten = (max, paragraph) => {
    if (paragraph.length <= max) return paragraph;
    return paragraph.slice(0, max - 3) + "..";
}

router.get('/', isLoggedIn, async (req, res) => {
    const user = req.user;
    const search = req.query.search || "";

    await user.populate('recipes');

    const recipes = await Recipe.find({ name: { $regex: search, $options: 'i' }, _id: { $in: [...user.recipes] } });

    res.render('view', { recipes, search, shorten });
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('new');
});

router.post('/new', isLoggedIn, async (req, res) => {
    try {
        const recipe = new Recipe(req.body);

        const { error } = recipeSchema.validate(recipe, { allowUnknown: true });

        // Ensure that all fields were entered correctly
        if (error) {
            const msg = error.details.map(el => el.message).join(',');
            throw new AppError(msg, 400);
        }

        // Save the recipe and update the user recipe list
        await recipe.save();
        req.user.recipes.push(recipe);
        await req.user.save();

        req.flash('success', 'Recipe Created Successfully!');
        res.redirect('/recipes');
    } catch (e) {
        req.flash('failure', e.message);
        res.redirect('/recipes/new');
    }

});

router.get('/:id', isLoggedIn, async (req, res, next) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);

    if (!recipe) {
        return next(new AppError('Recipe Not Found', 404));
    }

    res.render('showRecipe', { recipe });
});

router.delete('/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;

    await Recipe.deleteOne({ _id: id })

    req.flash('success', 'Recipe Deleted Successfully!');
    res.redirect('/recipes');
});

router.get('/:id/edit', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);

    if (!recipe) {
        return next(new AppError('Recipe Not Found', 404));
    }

    res.render('edit', { recipe });
});

router.put('/:id/edit', isLoggedIn, async (req, res, next) => {
    const { id } = req.params;
    const { error } = recipeSchema.validate(req.body, { allowUnknown: true });

    try {
        // Ensure that all fields were entered correctly
        if (error) {
            const msg = error.details.map(el => el.message).join(',');
            throw new AppError(msg, 400);
        }

        const recipe = await Recipe.findOneAndUpdate({ _id: id }, { ...req.body }, { runValidators: true });
        // Ensure that the recipe exists
        if (!recipe) {
            throw new AppError('Recipe Not Found', 404);
        }

        recipe.save();

        req.flash('success', 'Your Edit was Saved Successfully!');
        res.redirect(`/recipes/${id}`);

    } catch (e) {
        req.flash('failure', e.message);
        res.redirect(`/recipes/${id}/edit`);
        return next(e);
    }
})

module.exports = router;