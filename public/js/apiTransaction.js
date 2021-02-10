// initial values
const API_KEY = '86f9a380ffae3c355aa19faaf111a15a'
const url = 'https://api.themoviedb.org/3/search/movie?api_key=86f9a380ffae3c355aa19faaf111a15a'


// request movie
function requestMovie(url, onComplete, onError) {
    fetch(url)
        .then((res) => res.json())
        .then(onComplete)
        .catch(onError)
}


//search movie
function searchMovie(value) {
    const path = '/search/movie'
    const url = generateUrl(path) + '&query=' + value;
    requestMovie(url, renderSearchMovie, handleError);
}

//up comming movies
function getUpcomingMovie() {
    const path = '/movie/upcoming'
    const url = generateUrl(path);
    const render = renderMovie.bind({ container: upcomingContainer, title: 'Upcoming Movies' })
    requestMovie(url, render, handleError);
}

// top rated movies
function getTopRatedMovie() {
    const path = '/movie/top_rated'
    const url = generateUrl(path);
    const render = renderMovie.bind({ container: topContainer, title: 'Top Rated Movies' })
    requestMovie(url, render, handleError);
}

// most popular movies
function getPopularMovie() {
    const path = '/movie/popular'
    const url = generateUrl(path);
    const render = renderMovie.bind({ container: popularContainer, title: 'Popular Movies' })
    requestMovie(url, render, handleError);
}

