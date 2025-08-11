/* ================================
   INSTRUCTORS CAROUSEL FUNCTIONALITY
   Diplomado Neural Networks
   ================================ */

class InstructorsCarousel {
    constructor() {
        this.currentSlide = 0;
        this.instructors = [];
        this.isTransitioning = false;
        
        this.init();
    }

    async init() {
        try {
            await this.loadInstructorsData();
            this.renderInstructors();
            this.setupEventListeners();
            this.startAutoSlide();
        } catch (error) {
            console.error('Error initializing instructors carousel:', error);
        }
    }

    async loadInstructorsData() {
        try {
            const response = await fetch('../data/instructors-data.json');
            const data = await response.json();
            this.instructors = data.instructors;
        } catch (error) {
            console.error('Error loading instructors data:', error);
            throw error;
        }
    }

    renderInstructors() {
        const carouselContainer = document.querySelector('.carousel-container');
        if (!carouselContainer) return;

        // Create carousel structure
        const carouselHTML = `
            <div class="carousel-track">
                ${this.instructors.map(instructor => this.createInstructorSlide(instructor)).join('')}
            </div>
        `;

        carouselContainer.innerHTML = carouselHTML;

        // Create navigation
        this.createNavigation();
        this.createIndicators();
        
        // Update display
        this.updateCarousel();
    }

    createInstructorSlide(instructor) {
        return `
            <div class="carousel-slide">
                <div class="instructor-card">
                    <div class="instructor-photo-section">
                        <div class="instructor-photo">
                            <img src="${instructor.photo}" alt="${instructor.name}" class="instructor-image">
                        </div>
                        <img src="${instructor.institutionLogo}" alt="${instructor.institution}" class="institution-logo">
                    </div>
                    <div class="instructor-info">
                        <h3 class="instructor-name">${instructor.name}</h3>
                        <p class="instructor-title">${instructor.title}</p>
                        <p class="instructor-institution">${instructor.institution}</p>
                        <p class="instructor-biography">${instructor.biography}</p>
                    </div>
                </div>
            </div>
        `;
    }

    createNavigation() {
        const carouselContainer = document.querySelector('.carousel-container');
        const navHTML = `
            <div class="carousel-nav">
                <button class="carousel-button" id="prevBtn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <div class="carousel-indicators"></div>
                <button class="carousel-button" id="nextBtn">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        `;
        
        carouselContainer.insertAdjacentHTML('afterend', navHTML);
    }

    createIndicators() {
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        if (!indicatorsContainer) return;

        const indicatorsHTML = this.instructors.map((_, index) => 
            `<div class="carousel-dot" data-slide="${index}"></div>`
        ).join('');

        indicatorsContainer.innerHTML = indicatorsHTML;
    }

    setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        // Indicator dots
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // Pause auto-slide on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => this.pauseAutoSlide());
            carouselContainer.addEventListener('mouseleave', () => this.resumeAutoSlide());
        }

        // Touch/swipe support
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        const carouselTrack = document.querySelector('.carousel-track');
        if (!carouselTrack) return;

        let startX = 0;
        let startY = 0;
        let isDragging = false;

        carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        });

        carouselTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        carouselTrack.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = startX - endX;
            const deltaY = startY - endY;

            // Check if horizontal swipe is more significant than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }

            isDragging = false;
        });
    }

    nextSlide() {
        if (this.isTransitioning) return;
        
        this.currentSlide = (this.currentSlide + 1) % this.instructors.length;
        this.updateCarousel();
    }

    previousSlide() {
        if (this.isTransitioning) return;
        
        this.currentSlide = this.currentSlide === 0 
            ? this.instructors.length - 1 
            : this.currentSlide - 1;
        this.updateCarousel();
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        
        this.currentSlide = index;
        this.updateCarousel();
    }

    updateCarousel() {
        const carouselTrack = document.querySelector('.carousel-track');
        const dots = document.querySelectorAll('.carousel-dot');

        if (!carouselTrack) return;

        // Update track position
        this.isTransitioning = true;
        carouselTrack.style.transform = `translateX(-${this.currentSlide * 100}%)`;

        // Update indicators
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });

        // Update navigation buttons
        this.updateNavigationButtons();

        // Reset transition flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (this.instructors.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }

        // Always enable buttons for infinite loop
        if (prevBtn) prevBtn.disabled = false;
        if (nextBtn) nextBtn.disabled = false;
    }

    startAutoSlide() {
        if (this.instructors.length <= 1) return;
        
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 6000);
    }

    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
    }

    resumeAutoSlide() {
        this.startAutoSlide();
    }

    destroy() {
        this.pauseAutoSlide();
        // Remove event listeners if needed
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const instructorsSection = document.querySelector('.instructors-section');
    if (instructorsSection) {
        new InstructorsCarousel();
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    const carousel = window.instructorsCarousel;
    if (carousel) {
        if (document.hidden) {
            carousel.pauseAutoSlide();
        } else {
            carousel.resumeAutoSlide();
        }
    }
});