let router = require('express').Router();
const controller = require('./controller')



router
    .route("/")

    // get all favorite movies
    .get(checkAuthenticated, (req, res) => {
        const result = controller.getFavorites(req, res);
        result
            .then(data => {
                res.render('favorite', {
                    title: 'favorite',
                    style: 'favorite.css',
                    navbar: true,
                    footer: true,
                    favorites: data,
                    username: req.user.name
                })
            })
            .catch(error => { console.log(error) })
    })

    //create favorite movie
    .post(checkFevAuthenticated, (req, res) => {
        controller.createFavorite(req, res)
    })

    // remove favorite movie
    .delete(checkAuthenticated, (req, res) => {
        const result = controller.deleteFavorite(req, res)
        result
            .then(status => {
                res.json({ status })

            })
            .catch(err => console.log(err))
    })


//fev post auth check
function checkFevAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.sendStatus(403);
}

// check authenticated user
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    req.flash('error_msg', 'Please Login to manage your Favorite Movies')
    res.redirect('/account/login');
}

module.exports = router