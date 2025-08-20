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
                ${modules.map((module) => this.renderModuleCard(module)).join('')}
            </div>
        `;
    }

    renderModuleCard(module) {
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AcademicCalendarManager();
});