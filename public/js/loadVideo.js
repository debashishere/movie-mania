const baseUrl = `http://localhost:3000`

function generateUrl(path) {
    const url = baseUrl + `${path}`
    return url;
}

//get video from api
function getVideos(movieId, videoContainer, showCloseBtn) {
    //generate movie url
    const path = `/api/movie/${movieId}/videos`
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
    if (showCloseBtn) {
        videoContainer.innerHTML = `<button type="button" id = "close_video_btn">X</button>` // close btn
    }
    const videos = data.results;
    const length = videos.length > 4 ? 4 : videos.length;
    if (length > 0) {
        const iframeContainer = document.createElement('div');
        for (i = 0; i < length; i++) {
            const video = videos[i] // video
            const iframe = createIframe(video);
            iframeContainer.appendChild(iframe);
            videoContainer.appendChild(iframeContainer)
        }
    } else {
        const message = document.createElement('p');
        message.innerHTML = `No Video Available`
        videoContainer.appendChild(message);
    }
    const closeModal = document.getElementById('close_video_btn')
    closeModal.onclick = function () {
        overlay.classList.remove('active');
        modalContainer.classList.remove('active');
    }

}

// create iframe
function createIframe(video) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${video.key}`;
    iframe.width = 200;
    iframe.height = 200;
    iframe.allowFullscreen = true;
    return iframe;
}

