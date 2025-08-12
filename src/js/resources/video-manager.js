/* ================================
   VIDEO MANAGER FUNCTIONALITY
   Diplomado Neural Networks
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('videoSearchInput');
    const filters = document.querySelectorAll('.video-filter');
    const prevBtn = document.getElementById('videosPrevBtn');
    const nextBtn = document.getElementById('videosNextBtn');
    const pageInfo = document.getElementById('videosPageInfo');
    const paginationIndicators = document.getElementById('videosPaginationIndicators');
    const videosGrid = document.getElementById('videosGrid');
    
    // Configuration
    const ITEMS_PER_PAGE = 4;
    const MOBILE_ITEMS_PER_PAGE = 2;
    let currentPage = 1;
    let videoData = [];
    let videoCards = [];
    let filteredCards = [];
    let currentFilter = 'all';
    let currentSearch = '';
    
    // Check if mobile device
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Get items per page based on device
    function getItemsPerPage() {
        return isMobile() ? MOBILE_ITEMS_PER_PAGE : ITEMS_PER_PAGE;
    }
    
    // Load video data and initialize
    loadVideoData().then(() => {
        renderVideoCards();
        setupEventListeners();
        updateDisplay();
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        currentPage = 1;
        updateDisplay();
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
    
    // Render video cards dynamically
    function renderVideoCards() {
        videosGrid.innerHTML = '';
        
        videoData.forEach(video => {
            const videoCard = createVideoCard(video);
            videosGrid.appendChild(videoCard);
        });
        
        // Update references after rendering
        videoCards = document.querySelectorAll('.video-card');
        filteredCards = [...videoCards];
    }
    
    // Create individual video card
    function createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.dataset.module = video.moduleId;
        card.dataset.title = video.searchTerms;
        
        card.innerHTML = `
            <div class="video-thumbnail">
                <iframe src="https://www.youtube.com/embed/${video.youtubeId}" title="${video.title}" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-description">${video.description}</p>
                <div class="video-meta">
                    <span class="video-duration">${video.duration}</span>
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Setup event listeners (moved from inline)
    function setupEventListeners() {
        // Search functionality
        searchInput.addEventListener('input', function() {
            currentSearch = this.value.toLowerCase().trim();
            currentPage = 1;
            applyFilters();
        });
        
        // Filter functionality
        filters.forEach(filter => {
            filter.addEventListener('click', function() {
                currentFilter = this.dataset.module;
                currentPage = 1;
                
                // Update active filter
                filters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                applyFilters();
            });
        });
        
        // Video Card click handlers - setup event delegation
        videosGrid.addEventListener('click', function(e) {
            const card = e.target.closest('.video-card');
            if (card) {
                const title = card.querySelector('.video-title').textContent;
                const video = videoData.find(video => video.title === title);
                
                if (video && video.id) {
                    window.location.href = `video-player.html?video=${video.id}`;
                }
            }
        });
        
        // Touch slide functionality for mobile
        if (isMobile()) {
            let startX = 0;
            let startY = 0;
            
            videosGrid.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });
            
            videosGrid.addEventListener('touchend', function(e) {
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const diffX = startX - endX;
                const diffY = Math.abs(startY - endY);
                
                // Only trigger if horizontal swipe is more significant than vertical
                if (Math.abs(diffX) > 50 && diffY < 100) {
                    const itemsPerPage = getItemsPerPage();
                    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
                    
                    if (diffX > 0 && currentPage < totalPages) {
                        // Swipe left - next page
                        currentPage++;
                        updateDisplay();
                    } else if (diffX < 0 && currentPage > 1) {
                        // Swipe right - previous page
                        currentPage--;
                        updateDisplay();
                    }
                }
            });
        }
        
        // Pagination
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                updateDisplay();
            }
        });
        
        nextBtn.addEventListener('click', function() {
            const itemsPerPage = getItemsPerPage();
            const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                updateDisplay();
            }
        });
    }
    
    // Apply filters and search
    function applyFilters() {
        filteredCards = [...videoCards].filter(card => {
            const moduleMatch = currentFilter === 'all' || card.dataset.module === currentFilter;
            const searchMatch = currentSearch === '' || 
                card.dataset.title.toLowerCase().includes(currentSearch) ||
                card.querySelector('.video-title').textContent.toLowerCase().includes(currentSearch);
            
            return moduleMatch && searchMatch;
        });
        
        updateDisplay();
    }
    
    // Update display based on current page
    function updateDisplay() {
        const itemsPerPage = getItemsPerPage();
        const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        // Hide all cards
        videoCards.forEach(card => {
            card.classList.add('hidden');
        });
        
        // Show cards for current page
        filteredCards.slice(startIndex, endIndex).forEach(card => {
            card.classList.remove('hidden');
        });
        
        // Update pagination
        updatePagination(totalPages);
    }
    
    // Update pagination controls
    function updatePagination(totalPages) {
        // Hide/show prev button based on current page
        if (currentPage <= 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            prevBtn.disabled = false;
        }
        
        // Hide/show next button based on current page and total pages
        if (currentPage >= totalPages || totalPages === 0) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'flex';
            nextBtn.disabled = false;
        }
        
        if (totalPages === 0) {
            pageInfo.textContent = 'No se encontraron resultados';
        } else {
            pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        }
        
        // Generate indicators
        generateIndicators(totalPages);
        updateActiveIndicator();
    }
    
    // Generate pagination indicators
    function generateIndicators(totalPages) {
        paginationIndicators.innerHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'pagination-indicator';
            indicator.dataset.page = i;
            
            indicator.addEventListener('click', function() {
                currentPage = parseInt(this.dataset.page);
                updateDisplay();
            });
            
            paginationIndicators.appendChild(indicator);
        }
    }
    
    // Update active indicator
    function updateActiveIndicator() {
        const indicators = paginationIndicators.querySelectorAll('.pagination-indicator');
        indicators.forEach((indicator, index) => {
            if (index + 1 === currentPage) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    
    
});