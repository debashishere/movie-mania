const router = require('express').Router();

const api_key = `86f9a380ffae3c355aa19faaf111a15a`
const baseUrl = `https://api.themoviedb.org/3`
const axios = require('axios');

// generate url
function generateUrl(path) {

    const url = baseUrl + `${path}` + `?api_key=${api_key}`
    return url;

}

// request movie
async function requestMovie(url) {

    try {
        const result = await axios.get(url);
        return result.data;
    }

    catch (err) {
        console.log('err here', err);
        return false;
    }

}

//video
const getVideos = async (url) => {

    try {
        const result = await axios.get(url);
        return result.data
    }

    catch (err) {
        console.log(err);
        return false;
    }
}

//review 
const getReviews = async (url) => {

    try {
        const result = await axios.get(url);
        return result.data
    }

    catch (err) {
        console.log(err);
        return false;
    }
}


//@desc get now playing movies
//@router GET api/movie/now_playing
router.get('/movie/now_playing', async (req, res) => {

    try {
        const resData = [];
        const path = '/movie/now_playing';
        const url = generateUrl(path);
        const result = await axios.get(url);
        if (result.data) {
            result.data.results.every((item, index) => {
                if (index > 3) {
                    return false;
                } else {
                    resData.push(item);
                    return true;
                }
            })
        }
        res.status(200).send(resData)
    }

    catch (err) {
        console.log(err);
        res.status(404).send("not found")
    }

})

//@desc search movies
//@router GET api/search/movie
router.get('/search/movie', async (req, res) => {

    try {
        const term = req.query.term;
        const path = '/search/movie'
        const url = generateUrl(path) + '&query=' + term;
        const resData = await requestMovie(url);
        const movies = resData.results
        res.status(200).send(movies);
    }

    catch (err) {
        console.log(err);
        res.status(404).send('not found')
    }

})

//@desc get upcomming movies
//@router GET api/movie/upcomming
router.get('/movie/upcoming', async (req, res) => {

    try {
        const path = `/movie/upcoming`
        const url = generateUrl(path);
        const resData = await requestMovie(url);
        const movies = resData.results
        res.status(200).send(movies);
    }

    catch (err) {
        console.log('err', err)
        res.status(404).send('not found')
    }

})

//@desc get top rated movies
//@router GET api/movie/top_rated
router.get('/movie/top_rated', async (req, res) => {

    try {
        const path = `/movie/top_rated`
        const url = generateUrl(path);
        const resData = await requestMovie(url);
        const movies = resData.results
        res.status(200).send(movies);
    }

    catch (err) {
        console.log('err', err)
        res.status(404).send('not found')
    }

})

//@desc get popular  movies
//@router GET api/movie/popular
router.get('/movie/popular', async (req, res) => {

    try {
        const path = `/movie/popular`
        const url = generateUrl(path);
        const resData = await requestMovie(url);
        const movies = resData.results
        res.status(200).send(movies);
    }

    catch (err) {
        console.log('err', err)
        res.status(404).send('not found')
    }

})

//@desc get video by movie id
//@router GET api/movie/:movieId/videos
router.get('/movie/:movieId/videos', async (req, res) => {

    try {
        const movieId = req.params.movieId
        const path = `/movie/${movieId}/videos`
        const url = generateUrl(path);
        const resData = await getVideos(url);
        res.status(200).send(resData);
    }

    catch (err) {
        console.log(err);
        res.status(404).send("not found");
    }

})

//@desc get review by movie id
//@router GET api/movie/:movieId/reviews
router.get('/movie/:movieId/reviews', async (req, res) => {

    try {
        const movieId = req.params.movieId
        const path = `/movie/${movieId}/reviews`;
        const url = generateUrl(path);
        const resData = await getReviews(url);
        res.status(200).send(resData);

    }

    catch (err) {
        console.log(err);
        res.status(404).send("not found");
    }

})


module.exports = router;