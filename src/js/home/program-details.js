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
                    <div class="specific-objectives-grid">
                        ${objectives.specific.map((objective, index) => `
                            <div class="specific-objective-card">
                                <div class="objective-number">${index + 1}</div>
                                <p class="objective-text">${objective}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProgramDetailsManager();
});