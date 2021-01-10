// generate url
function generateUrl(path) {
    const url = `https://api.themoviedb.org/3${path}?api_key=86f9a380ffae3c355aa19faaf111a15a`
    return url;
}

//get video from api
function getVideos(movieId, videoContainer, showCloseBtn) {
    //generate movie url
    const path = `/movie/${movieId}/videos`
    const url = generateUrl(path);
    // fetch movie videos
    fetch(url)
        .then((res) => res.json())
        .then((data) => { createVideoTemplate(data, videoContainer, showCloseBtn) })
        .catch((err) => console.log(err));
}


// create video template
function createVideoTemplate(data, videoContainer, showCloseBtn) {
    videoContainer.innerHTML = '';
    //display movie video
    //close btn
    if (showCloseBtn) {
        videoContainer.innerHTML = `<button type="button" id = "close-video-btn">X</button>` // close btn
    }
    const videos = data.results;
    const length = videos.length > 4 ? 4 : videos.length;
    const iframeContainer = document.createElement('div');
    for (i = 0; i < length; i++) {
        const video = videos[i] // video
        const iframe = createIframe(video);
        iframeContainer.appendChild(iframe);
        videoContainer.appendChild(iframeContainer)
    }
}

// create iframe
function createIframe(video) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${video.key}`;
    iframe.width = 360;
    iframe.height = 315;
    iframe.allowFullscreen = true;
    return iframe;
}

// reviews 

function getReviews(movieId, reviewContainer) {
    const path = `/movie/${movieId}/reviews`;
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