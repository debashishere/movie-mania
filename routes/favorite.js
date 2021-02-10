let router = require('express').Router();
const controller = require('../controller/dbSupport')
const { checkAuthenticated } = require('../middleware/auth')
const { renderFavorite } = require(`../controller/render`)

router
    .route("/")

    // get all favorite movies
    .get(checkAuthenticated, (req, res) => {
        const result = controller.getFavorites(req, res);
        result
            .then(favorites => {
                if (favorites) {
                    const userName = req.user.name
                    renderFavorite(favorites, userName, res);
                    //render alert favorite added
                }
            })
            .catch(error => {
                console.log(error)
                //render error
            })
    })

    //create favorite movie
    .post(checkAuthenticated, (req, res) => {
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


module.exports = router