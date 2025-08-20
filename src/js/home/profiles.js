/* ================================
   PROFILES SECTION MANAGER
   Diplomado Neural Networks
   ================================ */

class ProfilesManager {
    constructor() {
        this.profilesData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadProfilesData();
            this.renderProfiles();
        } catch (error) {
            console.error('Error initializing profiles:', error);
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

    renderProfiles() {
        const container = document.querySelector('.profiles-content');
        if (!container || !this.profilesData) return;

        container.innerHTML = this.renderProfilesSection();
        lucide.createIcons();
    }

    renderProfilesSection() {
        const { aspirant, graduate } = this.profilesData;
        
        return `
            <div class="profiles-grid">
                ${this.renderProfileCard(aspirant, 'aspirant')}
                ${this.renderProfileCard(graduate, 'graduate')}
            </div>
        `;
    }

    renderProfileCard(profile, type) {
        const mainIcon = type === 'aspirant' ? 'target' : 'rocket';
        
        return `
            <div class="profile-card ${type}">
                <div class="profile-header">
                    <div class="profile-icon">
                        <i data-lucide="${mainIcon}"></i>
                    </div>
                    <div class="profile-title-group">
                        <h3 class="profile-title">${profile.title}</h3>
                        <p class="profile-tagline">${profile.tagline}</p>
                    </div>
                </div>
                
                <div class="profile-summary">
                    <p class="profile-description">${profile.description}</p>
                </div>

                <div class="profile-highlights">
                    <div class="highlights-grid">
                        ${profile.highlights.map(highlight => `
                            <div class="highlight-item">
                                <div class="highlight-icon-wrapper">
                                    <i data-lucide="${highlight.icon}" class="highlight-icon"></i>
                                </div>
                                <div class="highlight-content">
                                    <h4 class="highlight-title">${highlight.title}</h4>
                                    <p class="highlight-desc">${highlight.desc}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                ${profile.note ? `
                    <div class="profile-note">
                        <p>${profile.note}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfilesManager();
});