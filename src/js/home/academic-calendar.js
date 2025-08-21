/* ================================
   ACADEMIC CALENDAR MANAGER
   Diplomado Neural Networks
   ================================ */

class AcademicCalendarManager {
    constructor() {
        this.calendarData = null;
        this.currentSlide = 0;
        this.isTransitioning = false;
        this.autoSlideInterval = null;
        this.init();
    }

    async init() {
        try {
            await this.loadCalendarData();
            this.renderCalendar();
            this.initializeCarousel();
            this.startAutoSlide();
        } catch (error) {
            console.error('Error initializing academic calendar:', error);
        }
    }

    async loadCalendarData() {
        try {
            const response = await fetch('./src/data/academic-calendar.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.calendarData = await response.json();
        } catch (error) {
            console.error('Error loading calendar data:', error);
            throw error;
        }
    }

    renderCalendar() {
        const container = document.querySelector('.academic-calendar-content');
        if (!container || !this.calendarData) return;

        container.innerHTML = this.renderCalendarContent();
        lucide.createIcons();
    }

    renderCalendarContent() {
        const { program, modules } = this.calendarData;
        
        return `
            <div class="calendar-section">
                ${this.renderModulesSection(modules)}
                ${this.renderProgramSummary(program)}
            </div>
        `;
    }

    renderProgramSummary(program) {
        return `
            <div class="program-summary">
                <div class="program-summary-grid">
                    <div class="summary-item">
                        <div class="summary-item-label">Duraci&oacute;n</div>
                        <div class="summary-item-value">${program.duration}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-item-label">Sesiones</div>
                        <div class="summary-item-value">${program.sessions}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-item-label">Fecha de Inicio</div>
                        <div class="summary-item-value">${program.startDate}</div>
                    </div>
                    <div class="summary-item">
                        <div class="summary-item-label">Fecha de Fin</div>
                        <div class="summary-item-value">${program.endDate}</div>
                    </div>
                </div>
                <div class="program-schedule">
                    <div class="schedule-label">Horario</div>
                    <div class="schedule-value">${program.schedule}</div>
                </div>
            </div>
        `;
    }

    renderModulesSection(modules) {
        return `
            <div class="modules-section">
                <h3 class="modules-title">M&oacute;dulos del Programa</h3>
                <div class="modules-carousel-container">
                    <div class="modules-carousel-track" id="modulesCarouselTrack">
                        ${modules.map((module, index) => this.renderModuleSlide(module, index)).join('')}
                    </div>
                    
                    <div class="modules-carousel-navigation">
                        <button class="modules-carousel-btn modules-carousel-prev" id="modulesPrev">
                            <i data-lucide="chevron-left"></i>
                        </button>
                        <button class="modules-carousel-btn modules-carousel-next" id="modulesNext">
                            <i data-lucide="chevron-right"></i>
                        </button>
                    </div>
                    
                    <div class="modules-carousel-indicators" id="modulesIndicators">
                        ${modules.map((_, index) => `
                            <button class="modules-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderModuleSlide(module, index) {
        return `
            <div class="module-slide ${index === 0 ? 'active' : ''}" data-module="${module.id}">
                <div class="module-header">
                    <div class="module-name-badge">M&oacute;dulo ${index + 1}</div>
                    <h4 class="module-title">${module.name}</h4>
                    <p class="module-description">${module.description}</p>
                 
                </div>
                
                <div class="module-content">
                    <div class="module-topics">
                        <h5 class="topics-title">Contenido Tem&aacute;tico</h5>
                        <div class="topics-list">
                            ${module.topics.map(topic => `
                                <div class="topic-item">
                                    <div class="topic-icon">
                                        <i data-lucide="check"></i>
                                    </div>
                                    <div class="topic-text">${topic}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="module-meta">
                        <div class="meta-item">
                            <div class="meta-label">Horas</div>
                            <div class="meta-value">${module.hours}h</div>
                        </div>
                        <div class="meta-item">
                            <div class="meta-label">Sesiones</div>
                            <div class="meta-value">${module.sessions}</div>
                        </div>
                        <div class="meta-item">
                            <div class="meta-label">Per&iacute;odo</div>
                            <div class="meta-value">${this.formatPeriod(module.period)}</div>
                        </div>
                        <div class="meta-item instructor-item">
                            <div class="meta-label">Instructor</div>
                            <div class="meta-value instructor-name">${module.instructor}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    formatPeriod(period) {
        const parts = period.split(' al ');
        if (parts.length === 2) {
            const startParts = parts[0].split(' de ');
            const endParts = parts[1].split(' de ');
            
            if (startParts.length >= 3 && endParts.length >= 3) {
                return `${startParts[0]} ${startParts[1].slice(0, 3)} - ${endParts[0]} ${endParts[1].slice(0, 3)}`;
            }
        }
        return period;
    }

    initializeCarousel() {
        const slides = document.querySelectorAll('.module-slide');
        const indicators = document.querySelectorAll('.modules-indicator');
        const prevBtn = document.getElementById('modulesPrev');
        const nextBtn = document.getElementById('modulesNext');

        if (!slides.length) return;

        const showSlide = (index) => {
            if (this.isTransitioning) return;
            
            this.isTransitioning = true;
            this.currentSlide = index;

            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });

            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });

            setTimeout(() => {
                this.isTransitioning = false;
            }, 600);
        };

        const nextSlide = () => {
            if (this.isTransitioning) return;
            const nextIndex = (this.currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        };

        const prevSlide = () => {
            if (this.isTransitioning) return;
            const prevIndex = (this.currentSlide - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        };

        nextBtn?.addEventListener('click', nextSlide);
        prevBtn?.addEventListener('click', prevSlide);

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (this.isTransitioning) return;
                showSlide(index);
                this.resetAutoSlide();
            });
        });

        // Touch/swipe support
        this.initializeTouchSupport();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                this.resetAutoSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                this.resetAutoSlide();
            }
        });
    }

    initializeTouchSupport() {
        const track = document.getElementById('modulesCarouselTrack');
        if (!track) return;

        let startX = 0;
        let endX = 0;
        const minSwipeDistance = 50;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const swipeDistance = Math.abs(endX - startX);
            
            if (swipeDistance > minSwipeDistance) {
                if (endX < startX) {
                    // Swipe left - next slide
                    this.nextSlide();
                } else {
                    // Swipe right - previous slide
                    this.prevSlide();
                }
                this.resetAutoSlide();
            }
        }, { passive: true });
    }

    nextSlide() {
        if (this.isTransitioning) return;
        const slides = document.querySelectorAll('.module-slide');
        const nextIndex = (this.currentSlide + 1) % slides.length;
        this.showSlide(nextIndex);
    }

    prevSlide() {
        if (this.isTransitioning) return;
        const slides = document.querySelectorAll('.module-slide');
        const prevIndex = (this.currentSlide - 1 + slides.length) % slides.length;
        this.showSlide(prevIndex);
    }

    showSlide(index) {
        const slides = document.querySelectorAll('.module-slide');
        const indicators = document.querySelectorAll('.modules-indicator');
        
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.currentSlide = index;

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    startAutoSlide() {
        const slides = document.querySelectorAll('.module-slide');
        if (slides.length <= 1) return;

        // Stop any existing interval before starting a new one
        this.stopAutoSlide();

        this.autoSlideInterval = setInterval(() => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        }, 7000); // Change slide every 7 seconds
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }

    // Pause auto-slide when user hovers over carousel
    pauseOnHover() {
        const carousel = document.querySelector('.modules-carousel-container');
        if (!carousel) return;

        carousel.addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });

        carousel.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
    }

    // Initialize pause on hover after carousel is set up
    setupInteractions() {
        this.pauseOnHover();
        
        // Add intersection observer for performance
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const calendar = document.querySelector('.academic-calendar');
        if (!calendar) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startAutoSlide();
                } else {
                    this.stopAutoSlide();
                }
            });
        }, {
            threshold: 0.3
        });

        observer.observe(calendar);
    }

    // Public method to destroy the carousel
    destroy() {
        this.stopAutoSlide();
        
        // Remove event listeners
        const prevBtn = document.getElementById('modulesPrev');
        const nextBtn = document.getElementById('modulesNext');
        const indicators = document.querySelectorAll('.modules-indicator');
        
        prevBtn?.removeEventListener('click', this.prevSlide);
        nextBtn?.removeEventListener('click', this.nextSlide);
        
        indicators.forEach((indicator, index) => {
            indicator.removeEventListener('click', () => this.showSlide(index));
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calendarManager = new AcademicCalendarManager();
    
    // Setup additional interactions after initialization
    setTimeout(() => {
        calendarManager.setupInteractions();
    }, 1000);
    
    // Expose to global scope for debugging
    window.academicCalendarManager = calendarManager;
});