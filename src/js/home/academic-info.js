/* ================================
   ACADEMIC INFO MANAGER
   Handles Profiles, Calendar, and Requirements
   Diplomado Neural Networks
   ================================ */

class AcademicInfoManager {
    constructor() {
        this.profilesData = null;
        this.calendarData = null;
        this.requirementsData = null;
        this.init();
    }

    async init() {
        try {
            await Promise.all([
                this.loadProfilesData(),
                this.loadCalendarData(),
                this.loadRequirementsData()
            ]);
            
            this.renderProfiles();
            this.renderAcademicCalendar();
            this.renderGraduationRequirements();
        } catch (error) {
            console.error('Error initializing academic info:', error);
        }
    }

    async loadProfilesData() {
        try {
            const response = await fetch('./src/data/profiles.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.profilesData = await response.json();
        } catch (error) {
            console.error('Error loading profiles data:', error);
            throw error;
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

    renderProfiles() {
        const container = document.querySelector('.profiles-content');
        if (!container || !this.profilesData) return;

        const { aspirant, graduate } = this.profilesData;

        container.innerHTML = `
            <div class="profile-card aspirant">
                <div class="profile-header">
                    <h3 class="profile-title">${aspirant.title}</h3>
                </div>
                
                <p class="profile-description">${aspirant.description}</p>
                
                <ul class="profile-items">
                    ${aspirant.requirements.map(req => `
                        <li class="profile-item">
                            <p>${req}</p>
                        </li>
                    `).join('')}
                </ul>
                
                <div class="profile-note">
                    <p>${aspirant.note}</p>
                </div>
            </div>

            <div class="profile-card graduate">
                <div class="profile-header">
                    <h3 class="profile-title">${graduate.title}</h3>
                </div>
                
                <p class="profile-description">${graduate.description}</p>
                
                <ul class="profile-items">
                    ${graduate.competencies.map(comp => `
                        <li class="profile-item">
                            <p>${comp}</p>
                        </li>
                    `).join('')}
                </ul>
                
                <div class="profile-additional">
                    <p>${graduate.additional_skills}</p>
                </div>
            </div>
        `;
    }

    renderAcademicCalendar() {
        const container = document.querySelector('.academic-calendar-content');
        if (!container || !this.calendarData) return;

        const { program, modules } = this.calendarData;

        container.innerHTML = `
            <div class="program-overview">
                <h3 class="program-overview-title">Información General del Programa</h3>
                
                <div class="program-stats">
                    <div class="program-stat">
                        <div class="program-stat-value">${program.duration}</div>
                        <p class="program-stat-label">Duración Total</p>
                    </div>
                    <div class="program-stat">
                        <div class="program-stat-value">${program.sessions}</div>
                        <p class="program-stat-label">Sesiones</p>
                    </div>
                    <div class="program-stat">
                        <div class="program-stat-value">${program.startDate}</div>
                        <p class="program-stat-label">Fecha de Inicio</p>
                    </div>
                    <div class="program-stat">
                        <div class="program-stat-value">${program.endDate}</div>
                        <p class="program-stat-label">Fecha de Finalización</p>
                    </div>
                </div>
                
                <div class="schedule-note">
                    <p><strong>Horario:</strong> ${program.schedule}</p>
                    <p>${program.note}</p>
                </div>
            </div>

            <div class="modules-calendar">
                ${modules.map((module, index) => this.renderModuleCard(module, index)).join('')}
            </div>
        `;
    }

    renderModuleCard(module, index) {
        const instructorInitials = module.instructor.split(' ')
            .map(name => name.charAt(0))
            .slice(0, 2)
            .join('');

        return `
            <div class="module-card">
                <div class="module-header">
                    <div class="module-info">
                        <h3>${module.name}</h3>
                        <div class="module-period">${module.period}</div>
                        <div class="module-duration">
                            <span>${module.hours} horas</span>
                            <span>${module.sessions} sesiones</span>
                        </div>
                    </div>
                    <div class="module-stats">
                        <div class="module-stat">${module.hours}h</div>
                        <div class="module-stat">${module.sessions} sesiones</div>
                    </div>
                </div>
                
                <div class="module-content">
                    <p class="module-topics"><strong>Temas:</strong> ${module.topics}</p>
                </div>
                
                <div class="module-instructor">
                    <div class="instructor-icon">${instructorInitials}</div>
                    <div class="instructor-details">
                        <h4>${module.instructor}</h4>
                        <p>${module.institution}</p>
                    </div>
                </div>
            </div>
        `;
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
                ${this.requirementsData.requirements.map((req, index) => `
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
                    
                    <div class="buap-badge">BUAP</div>
                </div>
            </div>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AcademicInfoManager();
});