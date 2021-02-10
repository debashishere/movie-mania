const dbService = require('../controller/dbService');
const bcrypt = require('bcrypt');

// create favorite item in db
async function createFavorite(req, res) {

    try {
        const data = req.body;
        data.userId = parseInt(req.user.id)
        await dbService.createFavorite(data);
    }

    catch (err) {
        console.log(err)
    }
}

// get all favorite items
async function getFavorites(req, res) {

    try {
        const userId = parseInt(req.user.id)
        const result = await dbService.getFavorites(userId);
        return result;
    }

    catch (err) {
        console.log(err);
        return false;
    }
}

// delete fevorite movie
async function deleteFavorite(req, res) {

    try {
        const movieId = parseInt(req.body.movieId)
        const userId = parseInt(req.user.id)
        const result = dbService.deleteFavorite(movieId, userId);
        return result;
    }

    catch (err) {
        console.log(err);
        return false;
    }
}

// create User
function createUser(req, res) {
    try {
        const user = {};
        let errors = [];

        // set user
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password
        user.password2 = req.body.password2

        //check required field
        if (!user.name || !user.email || !user.password || !user.password2) {
            errors.push({ msg: 'Please fill in all fields' })
        }

        //check password matched
        if (user.password !== user.password2) {
            errors.push({ msg: 'Password do not matched' });
        }

        //check for any error
        if (errors.length > 0) {
            res.render('register', {
                errors: errors,
                name: user.name,
                email: user.email,
                title: 'Register',
                style: 'register.css',
                navbar: true,
                footer: true
            })
        }
        else {
            //validation passed
            //check if user already exists
            const userPromise = dbService.getUserByEmail(user.email);
            userPromise
                .then(async (dbUser) => {
                    errors.push({ msg: 'Email is already registered' })
                    if (dbUser) {
                        res.render('register', {
                            errors: errors,
                            name: user.name,
                            email: user.email,
                            title: 'Register',
                            style: 'register.css',
                            navbar: true,
                            footer: true
                        })
                    }
                    else {
                        // hash password
                        const hashedPassword = await bcrypt.hash(user.password, 10);
                        user.password = hashedPassword;
                        // crete user in db
                        const result = dbService.createUser(user);
                        result
                            .then((insertId) => {
                                if (insertId) {
                                    req.flash('success_msg', 'You are now registered and can login')
                                    res.redirect('/account/login')
                                }
                                else {
                                    req.flash('error_msg', 'Error While Registratation, Please Try again')
                                    res.redirect('/account/register')
                                }
                            })
                            .catch((error) => {
                                req.flash('error_msg', 'Error While Registratation, Please Try again')
                                res.redirect('/account/register')
                            })
                    }

                })
                .catch((err) => {
                    console.log('test err', err)

                })
        }

    }
    catch (error) {
        req.flash('error_msg', 'Error While Registratation, Please Try again')
        res.redirect('/account/register')
    }

}



module.exports.createFavorite = createFavorite;
module.exports.getFavorites = getFavorites;
module.exports.deleteFavorite = deleteFavorite;
module.exports.createUser = createUser;