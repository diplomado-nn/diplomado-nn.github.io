/* ================================
   PROGRAM DETAILS MANAGER
   Diplomado Neural Networks
   ================================ */

class ProgramDetailsManager {
    constructor() {
        this.programData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadProgramData();
            this.renderProgramDetails();
        } catch (error) {
            console.error('Error initializing program details:', error);
        }
    }

    async loadProgramData() {
        try {
            const response = await fetch('./src/data/program-details.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.programData = await response.json();
        } catch (error) {
            console.error('Error loading program data:', error);
            throw error;
        }
    }

    renderProgramDetails() {
        const container = document.querySelector('.program-details-content');
        if (!container || !this.programData) return;

        container.innerHTML = this.renderObjectivesSection();
        lucide.createIcons();
        this.initializeCarousel();
    }

    initializeCarousel() {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.getElementById('objectivesPrev');
        const nextBtn = document.getElementById('objectivesNext');

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

    renderObjectivesSection() {
        const { objectives } = this.programData;
        
        return `
            <div class="objectives-section">
                <div class="general-objective">
                    <h3 class="general-objective-title">Objetivo General</h3>
                    <p class="general-objective-text">${objectives.general}</p>
                </div>

                <div class="specific-objectives">
                    <h3 class="specific-objectives-title">Objetivos Específicos</h3>
                    <div class="carousel-container">
                        <div class="carousel-track" id="objectivesTrack">
                            ${objectives.specific.map((objective, index) => `
                                <div class="carousel-slide ${index === 0 ? 'active' : ''}">
                                    <div class="objective-icon">${this.getIconSVG(objective.icon)}</div>
                                    <h4 class="objective-title">${objective.title}</h4>
                                    <p class="objective-description">${objective.description}</p>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="carousel-navigation">
                            <button class="carousel-btn carousel-prev" id="objectivesPrev">
                                <i data-lucide="chevron-left"></i>
                            </button>
                            <button class="carousel-btn carousel-next" id="objectivesNext">
                                <i data-lucide="chevron-right"></i>
                            </button>
                        </div>
                        
                        <div class="carousel-indicators" id="objectivesIndicators">
                            ${objectives.specific.map((_, index) => `
                                <button class="indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getIconSVG(iconType) {
        const icons = {
            brain: '<i data-lucide="square-function"></i>',
            chart: '<i data-lucide="chart-scatter"></i>',
            code: '<i data-lucide="square-terminal"></i>',
            team: '<i data-lucide="users"></i>',
            presentation: '<i data-lucide="speech"></i>'
        };
        return icons[iconType] || icons.brain;
    }

}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProgramDetailsManager();
});