const router = require('express').Router()
const favorite = require('./favorite');
const account = require('./account');
const { renderHome, renderExplore, renderAbout } = require('../controller/render');

router.use('/favorite', favorite);
router.use('/account', account);



// home page
router.get('/', (req, res) => {
    renderHome(res);
})

//explore
router.get('/explore', (req, res) => {
    renderExplore(res);
})

//about
router.get('/about', (req, res) => {
    renderAbout(res);
})












module.exports = router;