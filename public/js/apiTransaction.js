
// request movie
function requestMovie(url, onComplete, onError) {
    fetch(url)
        .then((res) => res.json())
        .then(data => {
            onComplete(data)
        })
        .catch(onError)
}

//search movie
function searchMovie(value) {
    const path = '/api/search/movie'
    const url = generateUrl(path) + '?term=' + value;
    requestMovie(url, renderSearchMovie, handleError);
}

//up comming movies
function getUpcomingMovie() {
    const path = '/api/movie/upcoming'
    const url = generateUrl(path);
    const render = renderMovie.bind({ container: upcomingContainer, title: 'Upcoming Movies' })
    requestMovie(url, render, handleError);
}

// top rated movies
function getTopRatedMovie() {
    const path = '/api/movie/top_rated'
    const url = generateUrl(path);
    const render = renderMovie.bind({ container: topContainer, title: 'Top Rated Movies' })
    requestMovie(url, render, handleError);
}

// most popular movies
function getPopularMovie() {
    const path = '/api/movie/popular'
    const url = generateUrl(path);
    const render = renderMovie.bind({ container: popularContainer, title: 'Popular Movies' })
    requestMovie(url, render, handleError);
}

