
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

    renderRegisterPage: (res) => {

        res.render('register', {
            title: 'Register',
            style: 'register.css',
            navbar: true,
            footer: true
        })

    },

}