/* ================================
   PDF MANAGER FUNCTIONALITY
   Diplomado Neural Networks
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const filters = document.querySelectorAll('.pdf-filter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    const paginationIndicators = document.getElementById('paginationIndicators');
    const pdfsGrid = document.getElementById('pdfsGrid');
    
    // Configuration
    const ITEMS_PER_PAGE = 6;
    const MOBILE_ITEMS_PER_PAGE = 3;
    let currentPage = 1;
    let pdfData = [];
    let pdfCards = [];
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
    
    // Load PDF data and initialize
    loadPDFData().then(() => {
        renderPDFCards();
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
        filteredCards = [...pdfCards].filter(card => {
            const moduleMatch = currentFilter === 'all' || card.dataset.module === currentFilter;
            const searchMatch = currentSearch === '' || 
                card.dataset.title.toLowerCase().includes(currentSearch) ||
                card.querySelector('.pdf-title').textContent.toLowerCase().includes(currentSearch);
            
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
        pdfCards.forEach(card => {
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
    
    
    // Generate PDF URL (placeholder function)
    function generatePdfUrl(module, title) {
        // This is a placeholder function
        // In a real implementation, you would map titles to actual PDF file paths
        const baseUrl = '/data/libro/';
        const fileName = title.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-');
        
        return `${baseUrl}${module}/${fileName}.pdf`;
    }
    
    // Load PDF data from JSON
    async function loadPDFData() {
        try {
            const response = await fetch('../data/pdfs-data.json');
            const data = await response.json();
            pdfData = data.pdfs;
        } catch (error) {
            console.error('Error loading PDF data:', error);
            pdfData = [];
        }
    }
    
    // Render PDF cards dynamically
    function renderPDFCards() {
        pdfsGrid.innerHTML = '';
        
        pdfData.forEach(pdf => {
            const pdfCard = createPDFCard(pdf);
            pdfsGrid.appendChild(pdfCard);
        });
        
        // Update references after rendering
        pdfCards = document.querySelectorAll('.pdf-card');
        filteredCards = [...pdfCards];
    }
    
    // Create individual PDF card
    function createPDFCard(pdf) {
        const card = document.createElement('div');
        card.className = 'pdf-card';
        card.dataset.module = pdf.moduleId;
        card.dataset.title = pdf.searchTerms;
        
        card.innerHTML = `
            <div class="pdf-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
                </svg>
            </div>
            <div class="pdf-info">
                <h3 class="pdf-title">${pdf.title}</h3>
                <p class="pdf-description">${pdf.description}</p>
                <div class="pdf-meta">
                    <span class="pdf-pages">${pdf.pages} páginas</span>
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
        
        // PDF Card click handlers - setup event delegation
        pdfsGrid.addEventListener('click', function(e) {
            const card = e.target.closest('.pdf-card');
            if (card) {
                const title = card.querySelector('.pdf-title').textContent;
                const pdfId = pdfData.find(pdf => pdf.title === title)?.id;
                const pdf = pdfData.find(pdf => pdf.id === pdfId);
                
                if (pdf && pdf.url) {
                    window.open(pdf.url, '_blank');
                }
            }
        });
        
        // Touch slide functionality for mobile
        if (isMobile()) {
            let startX = 0;
            let startY = 0;
            
            pdfsGrid.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });
            
            pdfsGrid.addEventListener('touchend', function(e) {
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
});