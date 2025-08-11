/* ================================
   VIDEO PLAYER FUNCTIONALITY
   Diplomado Neural Networks
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    let videoData = [];

    // DOM Elements
    const mainVideoThumbnail = document.getElementById('mainVideoThumbnail');
    const mainVideoTitle = document.getElementById('mainVideoTitle');
    const mainVideoDescription = document.getElementById('mainVideoDescription');
    const mainVideoModule = document.getElementById('mainVideoModule');
    const mainVideoDuration = document.getElementById('mainVideoDuration');
    const sidebarVideos = document.getElementById('sidebarVideos');
    const sidebarSearch = document.getElementById('sidebarSearch');
    const backToListBtn = document.getElementById('backToListBtn');

    // Current video state
    let currentVideoId = null;
    let allVideos = [];

    // Load video data and initialize
    loadVideoData().then(() => {
        allVideos = [...videoData];
        initialize();
    });

    // Load video data from JSON
    async function loadVideoData() {
        try {
            const response = await fetch('../data/videos-data.json');
            const data = await response.json();
            videoData = data.videos;
        } catch (error) {
            console.error('Error loading video data:', error);
            videoData = [];
        }
    }

    // Get video ID from URL parameters
    function getVideoIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('video') || 'neural-network-basics'; // Default to first video
    }

    // Initialize the video player
    function initialize() {
        currentVideoId = getVideoIdFromURL();
        loadMainVideo(currentVideoId);
        populateSidebar();
        setupEventListeners();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Back to list button
        backToListBtn.addEventListener('click', function() {
            window.location.href = 'recursos.html#videos-section';
        });

        // Sidebar search
        sidebarSearch.addEventListener('input', function() {
            filterSidebarVideos(this.value.toLowerCase());
        });
    }

    // Load main video
    function loadMainVideo(videoId) {
        const video = videoData.find(v => v.id === videoId);
        if (!video) {
            console.error('Video not found:', videoId);
            return;
        }

        // Update main video
        const videoSrc = `https://www.youtube.com/embed/${video.youtubeId}`;
        mainVideoThumbnail.innerHTML = `<iframe src="${videoSrc}" frameborder="0" allowfullscreen></iframe>`;
        mainVideoTitle.textContent = video.title;
        mainVideoDescription.textContent = video.description;
        mainVideoModule.textContent = video.module;
        mainVideoDuration.textContent = video.duration;

        // Start video playback
        setTimeout(() => {
            const iframe = mainVideoThumbnail.querySelector('iframe');
            startVideoPlayback(iframe);
        }, 500);

        // Update page title
        document.title = `${video.title} - Diplomado Neural Networks`;
    }

    // Populate sidebar with other videos
    function populateSidebar() {
        const otherVideos = videoData.filter(video => video.id !== currentVideoId);
        renderSidebarVideos(otherVideos);
    }

    // Render sidebar videos
    function renderSidebarVideos(videos) {
        sidebarVideos.innerHTML = '';
        
        videos.slice(0, 6).forEach(video => {
            const sidebarCard = createSidebarVideoCard(video);
            sidebarVideos.appendChild(sidebarCard);
        });
    }

    // Create sidebar video card
    function createSidebarVideoCard(video) {
        const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
        
        const sidebarCard = document.createElement('div');
        sidebarCard.className = 'sidebar-video-card';
        sidebarCard.innerHTML = `
            <div class="sidebar-video-thumbnail">
                <img src="${thumbnailUrl}" alt="${video.title}" />
                <div class="play-overlay">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            </div>
            <div class="sidebar-video-info">
                <h4 class="sidebar-video-title">${video.title}</h4>
                <p class="sidebar-video-meta">${video.module} • ${video.duration}</p>
            </div>
        `;
        
        // Add click handler to switch videos
        sidebarCard.addEventListener('click', function() {
            switchToVideo(video.id);
        });
        
        return sidebarCard;
    }

    // Switch to different video
    function switchToVideo(videoId) {
        if (videoId === currentVideoId) return;

        // Stop current video
        const currentIframe = mainVideoThumbnail.querySelector('iframe');
        if (currentIframe) {
            stopVideoPlayback(currentIframe);
        }

        // Update URL without page reload
        const newUrl = `${window.location.pathname}?video=${videoId}`;
        window.history.pushState({videoId}, '', newUrl);

        // Update current video
        currentVideoId = videoId;
        loadMainVideo(videoId);
        populateSidebar();
    }

    // Filter sidebar videos
    function filterSidebarVideos(searchTerm) {
        const filteredVideos = videoData.filter(video => {
            if (video.id === currentVideoId) return false; // Exclude current video
            const title = video.title.toLowerCase();
            const description = video.description.toLowerCase();
            return title.includes(searchTerm) || description.includes(searchTerm);
        });
        
        renderSidebarVideos(filteredVideos);
    }

    // Extract YouTube video ID from URL
    function extractYouTubeId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    // Start video playback
    function startVideoPlayback(iframe) {
        if (iframe && iframe.src) {
            const currentSrc = iframe.src;
            const separator = currentSrc.includes('?') ? '&' : '?';
            
            if (!currentSrc.includes('autoplay=1')) {
                iframe.src = currentSrc + separator + 'autoplay=1&mute=1';
            }
        }
    }
    
    // Stop video playback
    function stopVideoPlayback(iframe) {
        if (iframe && iframe.src) {
            let currentSrc = iframe.src;
            currentSrc = currentSrc.replace(/[?&]autoplay=1/g, '');
            currentSrc = currentSrc.replace(/[?&]mute=1/g, '');
            iframe.src = currentSrc;
        }
    }

    // Handle browser back/forward navigation
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.videoId) {
            currentVideoId = event.state.videoId;
            loadMainVideo(currentVideoId);
            populateSidebar();
        }
    });
});