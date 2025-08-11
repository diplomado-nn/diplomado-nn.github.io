// ================================
// TESTIMONIALS CAROUSEL
// ================================

class TestimonialsCarousel {
    constructor() {
        this.currentSlide = 0;
        this.testimonials = [];
        this.isTransitioning = false;
        this.autoSlideInterval = null;
        
        this.init();
    }

    async init() {
        try {
            await this.loadTestimonialsData();
            this.renderTestimonials();
            this.setupEventListeners();
            this.startAutoSlide();
        } catch (error) {
            console.error('Error initializing testimonials carousel:', error);
        }
    }

    async loadTestimonialsData() {
        try {
            const response = await fetch('src/data/testimonials-data.json');
            const data = await response.json();
            this.testimonials = data.testimonials;
        } catch (error) {
            console.error('Error loading testimonials data:', error);
            throw error;
        }
    }

    renderTestimonials() {
        const track = document.getElementById('testimonialsTrack');
        const indicatorsContainer = document.getElementById('indicators');
        
        if (!track || !indicatorsContainer) return;

        // Render testimonial slides
        const slidesHTML = this.testimonials.map(testimonial => this.createTestimonialSlide(testimonial)).join('');
        track.innerHTML = slidesHTML;

        // Render indicators
        const indicatorsHTML = this.testimonials.map((_, index) => 
            `<button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>`
        ).join('');
        indicatorsContainer.innerHTML = indicatorsHTML;

        this.updateCarousel();
    }

    createTestimonialSlide(testimonial) {
        return `
            <div class="testimonial-slide">
                <img src="${testimonial.photo}" alt="${testimonial.name}" class="testimonial-image">
                <div class="testimonial-content">
                    <p class="testimonial-quote">
                        "${testimonial.quote}"
                    </p>
                    <p class="testimonial-author">${testimonial.name}, ${testimonial.title}</p>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const track = document.getElementById('testimonialsTrack');
        const testimonials = document.querySelector('.testimonials');

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.restartAutoSlide();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.restartAutoSlide();
            });
        }

        // Indicator clicks
        const indicators = document.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
                this.restartAutoSlide();
            });
        });

        // Pause auto-slide on hover
        if (testimonials) {
            testimonials.addEventListener('mouseenter', () => this.stopAutoSlide());
            testimonials.addEventListener('mouseleave', () => this.startAutoSlide());
        }

        // Touch/swipe support
        this.setupTouchEvents(track);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
                this.restartAutoSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
                this.restartAutoSlide();
            }
        });

        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoSlide();
            } else {
                this.startAutoSlide();
            }
        });
    }

    setupTouchEvents(track) {
        if (!track) return;

        let startX = 0;
        let endX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.stopAutoSlide();
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            endX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            if (!isDragging) return;

            const diff = startX - endX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }

            isDragging = false;
            this.startAutoSlide();
        });
    }

    nextSlide() {
        if (this.isTransitioning) return;
        
        this.currentSlide = (this.currentSlide + 1) % this.testimonials.length;
        this.updateCarousel();
    }

    prevSlide() {
        if (this.isTransitioning) return;
        
        this.currentSlide = this.currentSlide === 0 
            ? this.testimonials.length - 1 
            : this.currentSlide - 1;
        this.updateCarousel();
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        
        this.currentSlide = index;
        this.updateCarousel();
    }

    updateCarousel() {
        const track = document.getElementById('testimonialsTrack');
        const indicators = document.querySelectorAll('.carousel-indicator');

        if (!track) return;

        // Update track position
        this.isTransitioning = true;
        const translateX = -this.currentSlide * 100;
        track.style.transform = `translateX(${translateX}%)`;

        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        // Reset transition flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    startAutoSlide() {
        if (this.testimonials.length <= 1) return;
        
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 10000);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    restartAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) {
        new TestimonialsCarousel();
    }
});