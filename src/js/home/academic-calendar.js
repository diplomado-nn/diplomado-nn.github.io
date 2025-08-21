/* ================================
   ACADEMIC CALENDAR MANAGER
   Diplomado Neural Networks
   ================================ */

class AcademicCalendarManager {
    constructor() {
        this.calendarData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadCalendarData();
            this.renderAcademicCalendar();
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

    renderAcademicCalendar() {
        const container = document.querySelector('.academic-calendar-content');
        if (!container || !this.calendarData) return;

        const { program, modules } = this.calendarData;

        container.innerHTML = `
            <div class="academic-calendar-overview">
                <h3 class="academic-calendar-overview-title">Información General del Programa</h3>
                
                <div class="academic-calendar-stats">
                    <div class="academic-calendar-stat">
                        <div class="academic-calendar-stat-value">${program.duration}</div>
                        <p class="academic-calendar-stat-label">Duración Total</p>
                    </div>
                    <div class="academic-calendar-stat">
                        <div class="academic-calendar-stat-value">${program.sessions}</div>
                        <p class="academic-calendar-stat-label">Sesiones</p>
                    </div>
                    <div class="academic-calendar-stat">
                        <div class="academic-calendar-stat-value">${program.startDate}</div>
                        <p class="academic-calendar-stat-label">Fecha de Inicio</p>
                    </div>
                    <div class="academic-calendar-stat">
                        <div class="academic-calendar-stat-value">${program.endDate}</div>
                        <p class="academic-calendar-stat-label">Fecha de Finalización</p>
                    </div>
                </div>
                
                <div class="academic-calendar-note">
                    <p><strong>Horario:</strong> ${program.schedule}</p>
                    <p>${program.note}</p>
                </div>
            </div>

            <div class="academic-calendar-modules">
                <h3 class="academic-calendar-modules-title">Módulos del Programa</h3>
                <div class="calendar-carousel-container">
                    <div class="calendar-carousel-track" id="calendarTrack">
                        ${modules.map((module, index) => this.renderModuleCard(module, index)).join('')}
                    </div>
                    
                    <div class="calendar-carousel-navigation">
                        <button class="calendar-carousel-btn calendar-prev" id="calendarPrev">
                            <i data-lucide="chevron-left"></i>
                        </button>
                        <button class="calendar-carousel-btn calendar-next" id="calendarNext">
                            <i data-lucide="chevron-right"></i>
                        </button>
                    </div>
                    
                    <div class="calendar-carousel-indicators" id="calendarIndicators">
                        ${modules.map((_, index) => `
                            <button class="calendar-indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        lucide.createIcons();
        this.initializeCarousel();
    }

    renderModuleCard(module, index) {
        const instructorInitials = module.instructor.split(' ')
            .map(name => name.charAt(0))
            .slice(0, 2)
            .join('');

        return `
            <div class="calendar-carousel-slide ${index === 0 ? 'active' : ''}">
                <div class="calendar-module-card">
                    <div class="calendar-module-header">
                        <div class="calendar-module-number">${index + 1}</div>
                        <h3 class="calendar-module-title">${module.name}</h3>
                        <div class="calendar-module-period">${module.period}</div>
                        
                        <div class="calendar-module-stats">
                            <div class="calendar-module-stat">
                                <div class="calendar-module-stat-value">${module.hours}</div>
                                <p class="calendar-module-stat-label">Horas</p>
                            </div>
                            <div class="calendar-module-stat">
                                <div class="calendar-module-stat-value">${module.sessions}</div>
                                <p class="calendar-module-stat-label">Sesiones</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="calendar-module-content">
                        <p class="calendar-module-topics">${module.topics}</p>
                    </div>
                    
                    <div class="calendar-module-instructor">
                        <div class="calendar-instructor-icon">${instructorInitials}</div>
                        <div class="calendar-instructor-details">
                            <h4>${module.instructor}</h4>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initializeCarousel() {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.calendar-carousel-slide');
        const indicators = document.querySelectorAll('.calendar-indicator');
        const prevBtn = document.getElementById('calendarPrev');
        const nextBtn = document.getElementById('calendarNext');

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        };

        nextBtn?.addEventListener('click', nextSlide);
        prevBtn?.addEventListener('click', prevSlide);

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AcademicCalendarManager();
});