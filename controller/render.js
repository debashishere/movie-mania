
module.exports = {

    renderFavorite: (data, userName, res) => {

        res.render('favorite', {
            title: 'favorite',
            style: 'favorite.css',
            navbar: true,
            footer: true,
            favorites: data,
            username: userName
        })

    },

    renderHome: (res) => {

        res.render('home', {
            title: 'home',
            style: 'home.css',
            navbar: true,
            footer: true
        })

    },

    renderExplore: (res) => {

        res.render('explore', {
            title: 'explore',
            style: 'explore.css',
            navbar: true,
            footer: true,
        })

    },

    renderAbout: (res) => {

        res.render('about', {
            title: 'about',
            style: 'about.css',
            navbar: true,
            footer: true
        })

    },

    renderLoginPage: (res) => {

        res.render('login', {
            title: 'Login',
            navbar: true,
            footer: true,
            style: 'login.css'
        })

    },

    renderRegisterPage: (res, data = null) => {
        if (data) {
            res.render('register', {
                errors: data.errors,
                name: data.name,
                email: data.email,
                title: 'Register',
                style: 'register.css',
                navbar: true,
                footer: true
            })
        }
        else {
            res.render('register', {
                title: 'Register',
                style: 'register.css',
                navbar: true,
                footer: true
            })
        }
    }
}