const express = require('express');
const router = express.Router();

const Recipe = require('../models/recipe.js');
const AppError = require('../AppError.js');
const { isLoggedIn } = require('../Utils.js');
const { seedDatabase } = require('../seed.js');

router.get('/', isLoggedIn, async (req, res) => {

    const user = req.user;
    const search = req.query.search || "";

    await user.populate('recipes');

    const recipes = await Recipe.find({ name: { $regex: search, $options: 'i' }, _id: { $in: [...user.recipes] } });
    res.render('view', { recipes, search });
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render('new');
});

router.post('/new', isLoggedIn, async (req, res) => {

    try {
        const recipe = new Recipe(req.body);
        await recipe.save();

        req.user.recipes.push(recipe);
        await req.user.save();

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

router.put('/:id/edit', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe.findOneAndUpdate({ _id: id }, { ...req.body }, { runValidators: true });

        if (!recipe) {
            return next(new AppError('Recipe Not Found', 404));
        }

        recipe.save();
        res.redirect(`/recipes/${id}`);
    } catch (e) {
        return next(new AppError('Problem occured while trying to edit recipe!'));
    }
})

module.exports = router;