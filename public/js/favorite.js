const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-container');
const videoContainer = document.querySelector('.video-container');
const modalClose = document.getElementById('modal-close');

const logoutBtn = document.getElementById('logout-btn');
logoutBtn.addEventListener('click', (event) => {
    event.stopPropagation();
})

document.onclick = function (event) {
    const target = event.target;

    // remove icon
    if (target.classList[0] === 'fa') {
        const movieId = target.dataset.movieId
        removeFavorite(movieId);

    }

    // check for click in image or explore button
    if (target.tagName.toLowerCase() === 'img' || target.tagName.toLowerCase() === 'button') {
        const movieId = target.dataset.movieId;
        exploreFavorite(movieId);
    }

}

// remove favorite movie, fetch delete
function removeFavorite(movieId) {
    const data = {
        movieId: movieId
    }

    const url = 'http://localhost:3000/favorite'
    fetch(url, {
        method: 'delete',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
        .then(res => res.json())
        .then(data => {
            if (data.status) {
                // reload page after deletion
                window.location.reload();
            }
        })
        .catch(err => console.log(err))
}


// explore favorite
function exploreFavorite(movieId) {
    overlay.classList.add('overlay-active');
    modalContainer.classList.add('modal-active');
    const closeBtnFlag = false;
    getVideos(movieId, videoContainer, closeBtnFlag);
    showReviews(movieId);

}

// close popup modal
modalClose.onclick = function (e) {
    e.stopPropagation();
    overlay.classList.remove('overlay-active');
    modalContainer.classList.remove('modal-active');
}

// show reviews
function showReviews(movieId) {
    const reviewContainer = document.querySelector('.review-container');
    getReviews(movieId, reviewContainer);
}

