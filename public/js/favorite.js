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
        .then(res => {
            if (res.status == 200) {
                // reload page after deletion
                //remove without redirect
                window.location.reload();
            }
            else {
                // unable to delete
            }
        })
        .catch(err =>
            console.log(err)
            // unable to delete
        )
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
    e.preventDefault();
    e.stopPropagation()
    overlay.classList.remove('overlay-active');
    modalContainer.classList.remove('modal-active');
}

// show reviews
function showReviews(movieId) {
    const reviewContainer = document.querySelector('.review-container');
    getReviews(movieId, reviewContainer);
}

// reviews 

function getReviews(movieId, reviewContainer) {

    const path = `/api/movie/${movieId}/reviews`;
    const url = generateUrl(path);
    fetch(url)
        .then(res => res.json())
        .then(data => createReviewTemplate(data, reviewContainer))
        .catch(err => console.log(err))
}

function createReviewTemplate(data, reviewContainer) {
    const reviews = data.results;

    // pick top 3 reviews
    const length = reviews.length > 3 ? 3 : reviews.length
    if (length == 0) {
        reviewContainer.innerHTML = '<h1>Reviews</h1> <p style="text-align: center" >No reviews available</p>';
    }
    else {
        reviewContainer.innerHTML = '<h1>Reviews</h1>';
    }

    for (i = 0; i < length; i++) {
        const element = document.createElement('div');
        element.classList.add('review-item')
        element.innerHTML = `
        <div class="review-author">
            <p><span>Author :</span> ${reviews[i].author} </p>
        </div>
        <div class="review-content">
        <p>${reviews[i].content}</p>
            </div>
        `;
        reviewContainer.appendChild(element);
    }
}
