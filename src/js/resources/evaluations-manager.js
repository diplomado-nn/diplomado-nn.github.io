/* ================================
   EVALUATIONS MANAGER FUNCTIONALITY
   Diplomado Neural Networks
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('evaluationSearchInput');
    const filters = document.querySelectorAll('.evaluation-filter');
    const prevBtn = document.getElementById('evaluationsPrevBtn');
    const nextBtn = document.getElementById('evaluationsNextBtn');
    const pageInfo = document.getElementById('evaluationsPageInfo');
    const paginationIndicators = document.getElementById('evaluationsPaginationIndicators');
    const evaluationsGrid = document.getElementById('evaluationsGrid');
    
    // Configuration
    const ITEMS_PER_PAGE = 6;
    const MOBILE_ITEMS_PER_PAGE = 3;
    let currentPage = 1;
    let evaluationData = [];
    let evaluationCards = [];
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
    
    // Load evaluation data and initialize
    loadEvaluationData().then(() => {
        renderEvaluationCards();
        setupEventListeners();
        updateDisplay();
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        currentPage = 1;
        updateDisplay();
    });
    
    // Apply filters and search
    function applyFilters() {
        filteredCards = [...evaluationCards].filter(card => {
            const moduleMatch = currentFilter === 'all' || card.dataset.module === currentFilter;
            const searchMatch = currentSearch === '' || 
                card.dataset.title.toLowerCase().includes(currentSearch) ||
                card.querySelector('.evaluation-title').textContent.toLowerCase().includes(currentSearch);
            
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
        evaluationCards.forEach(card => {
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
            indicator.className = 'evaluation-pagination-indicator';
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
        const indicators = paginationIndicators.querySelectorAll('.evaluation-pagination-indicator');
        indicators.forEach((indicator, index) => {
            if (index + 1 === currentPage) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Load evaluation data from JSON
    async function loadEvaluationData() {
        try {
            const response = await fetch('../data/evaluations-data.json');
            const data = await response.json();
            evaluationData = data.evaluations;
        } catch (error) {
            console.error('Error loading evaluation data:', error);
            evaluationData = [];
        }
    }
    
    // Render evaluation cards dynamically
    function renderEvaluationCards() {
        evaluationsGrid.innerHTML = '';
        
        evaluationData.forEach(evaluation => {
            const evaluationCard = createEvaluationCard(evaluation);
            evaluationsGrid.appendChild(evaluationCard);
        });
        
        // Update references after rendering
        evaluationCards = document.querySelectorAll('.evaluation-card');
        filteredCards = [...evaluationCards];
    }
    
    // Create individual evaluation card
    function createEvaluationCard(evaluation) {
        const card = document.createElement('div');
        card.className = 'evaluation-card';
        card.dataset.module = evaluation.moduleId;
        card.dataset.title = evaluation.searchTerms;
        
        card.innerHTML = `
            <div class="evaluation-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd"/>
                </svg>
            </div>
            <div class="evaluation-info">
                <h3 class="evaluation-title">${evaluation.title}</h3>
                <p class="evaluation-description">${evaluation.description}</p>
                <div class="evaluation-meta">
                    <span class="evaluation-pages">${evaluation.pages} páginas</span>
                </div>
            </div>
        `;
        
        return card;
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                currentSearch = this.value.toLowerCase().trim();
                currentPage = 1;
                applyFilters();
            });
        }
        
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
        
        // Evaluation Card click handlers - setup event delegation
        evaluationsGrid.addEventListener('click', function(e) {
            const card = e.target.closest('.evaluation-card');
            if (card) {
                const title = card.querySelector('.evaluation-title').textContent;
                const evaluationId = evaluationData.find(evaluation => evaluation.title === title)?.id;
                const evaluation = evaluationData.find(evaluation => evaluation.id === evaluationId);
                
                if (evaluation && evaluation.url) {
                    window.open(evaluation.url, '_blank');
                }
            }
        });
        
        // Touch slide functionality for mobile
        if (isMobile()) {
            let startX = 0;
            let startY = 0;
            
            evaluationsGrid.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });
            
            evaluationsGrid.addEventListener('touchend', function(e) {
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
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                if (currentPage > 1) {
                    currentPage--;
                    updateDisplay();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                const itemsPerPage = getItemsPerPage();
                const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    updateDisplay();
                }
            });
        }
    }
});