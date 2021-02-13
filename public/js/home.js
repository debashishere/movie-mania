

//********---------------Content---------------**************
const nowPlayingContent = document.querySelector('.now-playing-content');
const posterPrefix = 'https://image.tmdb.org/t/p/w500'
const baseUrl = `https://fav-movie-mania.herokuapp.com`

// generate url
function generateUrl(path) {
    const url = baseUrl + path;
    return url;
}


// request now playing 
function getNowPlaying(onComplete, onError) {
    const path = '/api/movie/now_playing';
    const url = generateUrl(path);
    fetch(url)
        .then((res) => res.json())
        .then(data => {
            onComplete(data);
        })
        .catch(onError)
}


// on complete
// render view
function createTemplate(movies) {
    // const movies = data.results;
    const length = movies.length

    for (i = 0; i < length; i++) {
        const element = document.createElement('div');
        element.classList.add('now-playing-item');
        const posterUrl = posterPrefix + movies[i].poster_path;
        element.innerHTML = `
        <div class='img-container'>
            <img src='${posterUrl}'>
         </div>
        <div class='details-container'>
            <div class="details-content">
                <p>${movies[i].title}</p>
                <p>Release Date:<span> ${movies[i].release_date}</span></p>
            </div>
        </div>
        
        `
        nowPlayingContent.appendChild(element);
    }

}


// on error 
function handleError(error) {
    // console.log(error)
}



getNowPlaying(createTemplate, handleError);