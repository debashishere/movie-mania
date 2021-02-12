let router = require('express').Router();
const { checkAuthenticated, checkApiAuthenticated } = require('../middleware/auth')
const { renderFavorite } = require(`../controller/render`)
const { getFavorites, createFavorite, deleteFavorite } = require('../controller/dbService')


router
    .route("/")

    // get all favorite movies
    .get(checkAuthenticated, async (req, res) => {
        try {
            const userId = parseInt(req.user.id)
            const favorites = await getFavorites(userId);
            const userName = req.user.name
            renderFavorite(favorites, userName, res);
        }

        catch (err) {
            req.flash('error_msg', 'Failed to login, Please try again')
            res.redirect('/account/login');
        }

    })

    //create favorite movie
    .post(checkApiAuthenticated, async (req, res) => {

        try {
            const data = req.body;
            data.userId = parseInt(req.user.id)
            const isCreated = await createFavorite(data);
            if (isCreated) {
                res.status(200).send(true);
            } else {
                res.status(200).send(false);
            }
        }

        catch (err) {
            console.log(err);
            res.status(404).send(false);
        }

    })

    // remove favorite movie
    .delete(checkAuthenticated, async (req, res) => {

        try {
            const movieId = parseInt(req.body.movieId)
            const userId = parseInt(req.user.id)
            const status = await deleteFavorite(movieId, userId);
            if (status) {
                res.status(200).send("Favorite item removed")
            } else {
                res.status(404).send("unable to remove favorite item")
            }
        }

        catch (err) {
            console.log(err);
            res.status(404).send("unable to remove favorite item")
        }

    })


module.exports = router