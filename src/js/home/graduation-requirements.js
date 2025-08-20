/* ================================
   GRADUATION REQUIREMENTS MANAGER
   Diplomado Neural Networks
   ================================ */

class GraduationRequirementsManager {
    constructor() {
        this.requirementsData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadRequirementsData();
            this.renderGraduationRequirements();
        } catch (error) {
            console.error('Error initializing graduation requirements:', error);
        }
    }

    async loadRequirementsData() {
        try {
            const response = await fetch('./src/data/graduation-requirements.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.requirementsData = await response.json();
        } catch (error) {
            console.error('Error loading requirements data:', error);
            throw error;
        }
    }

    renderGraduationRequirements() {
        const container = document.querySelector('.graduation-requirements-content');
        if (!container || !this.requirementsData) return;

        const icons = {
            'evaluation': '📊',
            'attendance': '📅'
        };

        container.innerHTML = `
            <div class="requirements-grid">
                ${this.requirementsData.requirements.map((req) => `
                    <div class="requirement-card">
                        <div class="requirement-header">
                            <div class="requirement-icon">${icons[req.id] || '✓'}</div>
                            <h3 class="requirement-title">${req.title}</h3>
                        </div>
                        
                        <p class="requirement-description">${req.description}</p>
                        
                        <div class="requirement-details">
                            <p>${req.details}</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="certification-section">
                <div class="certification-content">
                    <h3 class="certification-title">${this.requirementsData.certification.title}</h3>
                    
                    <p class="certification-description">${this.requirementsData.certification.description}</p>
                    
                    <div class="certification-note">
                        <p>${this.requirementsData.certification.note}</p>
                    </div>
                    
                    <div class="buap-badge">
                        <img src="../../../assets/logos/logo_buap.png" alt="buap logo" class="buap-logo"></img>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GraduationRequirementsManager();
});