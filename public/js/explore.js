
const posterPrefix = 'https://image.tmdb.org/t/p/w500'

//Select DOM Element 
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const movieSection = document.querySelector('.movie-section');

const upcomingContainer = document.querySelector('.upcoming-container');
const popularContainer = document.querySelector('.popular-container');
const topContainer = document.querySelector('.top-container');

const overlay = document.getElementById('overlay');
const modalContainer = document.getElementById('modal_container');
const modalContent = document.getElementById('modal_content');

function renderSearchMovie(data) {
    movieSection.innerHTML = ''
    movieSection.style.marginTop = "50px";
    const movieBlock = createMovieContainer(data);
    movieSection.appendChild(movieBlock);
}

function renderMovie(data) {
    const movieBlock = createMovieContainer(data);
    const heading = document.createElement('h3')
    heading.textContent = this.title
    this.container.appendChild(heading);
    this.container.appendChild(movieBlock);
}


function handleError(error) {
    console.log(error);
}
// fetch for search
searchBtn.onclick = function (event) {
    event.preventDefault;
    const searchValue = searchInput.value;
    searchMovie(searchValue);
    searchInput.value = '';
}

// create movie cards
function createMovieContainer(movie) {
    const movieContainer = document.createElement('div');
    movieContainer.setAttribute('class', 'movie-container');
    movie.forEach((item) => {
        if (item.poster_path) {
            posterUrl = posterPrefix + item.poster_path;
        }

        const newItem = filterData(item);
        const movieElement = document.createElement('div');
        movieElement.setAttribute('class', 'movie-item');
        const movieCard = `
                <div class="fev-logo"><i class="fas fa-heart"></i> </div>
                <div class='img-container'>
                    <img src='${posterUrl}' data-movie-id=${newItem.id}>
                </div>
                <div class='details-container'>
                    <div class="details-content">
                        <p>${newItem.original_title}</p>
                        <p>${newItem.release_year}</p>
                    </div>
                </div> 
                `;
        movieElement.innerHTML = movieElement.innerHTML + movieCard;
        movieContainer.appendChild(movieElement)
    })
    slider(movieContainer);
    return movieContainer;
}

// filter movie data
function filterData(item) {
    const newItem = {};
    if (item.original_title) {
        newItem.original_title = item.original_title
    } else {
        newItem.original_title = 'N/A'
    }
    newItem.release_year = item.release_date.slice(0, 4)
    newItem.id = item.id;

    return newItem;
}

// toggle video section on click
document.onclick = function (event) {

    const target = event.target;
    // target fevorite icon
    if (target.classList[0] == 'fas') {
        getMovieCard(target)
    }

    if (target.tagName.toLowerCase() === 'img') {
        const movieId = target.dataset.movieId;
        overlay.classList.add('active');
        modalContainer.classList.add('active');
        // fetch video
        const showCloseBtn = true;
        getVideos(movieId, modalContent, showCloseBtn)
    }
    if (target.id === 'close-video-btn') {
        const movieVideo = target.parentElement;
        movieVideo.classList.remove('video-display')
    }

}

// get movie card data to db
function getMovieCard(target) {
    const logoDiv = target.parentElement;
    const imgDiv = logoDiv.nextElementSibling;
    const img = imgDiv.children[0];
    const imagePath = img.src;
    const movieId = img.dataset.movieId
    const detailsConatiner = imgDiv.nextElementSibling;
    const detailsContent = detailsConatiner.children[0];
    const details = detailsContent.children;
    const title = details[0].textContent;
    const year = details[1].textContent;

    postMovieCard(imagePath, movieId, title, year);
}


function postMovieCard(imagePath, movieId, title, year) {
    let data = {
        imagePath: imagePath,
        movieId: movieId,
        title: title,
        year: year
    }
    const url = 'http://localhost:3000/favorite';
    fetch(url, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
        .then((res) => {

            if (res.status == 200) {
                //created
            }
            else if (res.status == 401) {
                console.log("unauthenticated")
            }
        })
        .catch(err => console.log(err))
}


// show alert
function showAlert(text) {
    console.log(text)
}

function slider(movieContainer) {
    let isDown = false;
    let startX;
    let scrollLeft;

    movieContainer.addEventListener('mousedown', (event) => {
        isDown = true;
        startX = event.pageX - movieContainer.offsetLeft;
        scrollLeft = movieContainer.scrollLeft;
    })

    movieContainer.addEventListener('mouseleave', (event) => {
        isDown = false;
    })

    movieContainer.addEventListener('mouseup', (event) => {
        isDown = false;
    })

    movieContainer.addEventListener('mousemove', (event) => {
        if (!isDown) return;
        event.preventDefault();
        const x = event.pageX - movieContainer.offsetLeft;
        const slide = (x - startX) * 3.5;
        movieContainer.scrollLeft = scrollLeft - slide;
    })
}


getUpcomingMovie();

getTopRatedMovie();

getPopularMovie();