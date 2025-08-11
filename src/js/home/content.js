// ================================
// CONTENT SECTION INTERACTIONS - NEURAL NETWORK THEME
// Diplomado Neural Networks
// ================================

document.addEventListener('DOMContentLoaded', function() {
    const contentModulesContainer = document.querySelector('.content-modules');
    let moduleData = [];
    let modules = [];
    
    // Load module data and initialize
    loadModuleData().then(() => {
        renderModules();
        setupModuleAnimations();
    });
    
    // Load module data from JSON
    async function loadModuleData() {
        try {
            const response = await fetch('src/data/content-modules.json');
            const data = await response.json();
            moduleData = data.modules.sort((a, b) => a.order - b.order);
        } catch (error) {
            console.error('Error loading module data:', error);
            moduleData = [];
        }
    }
    
    // Render modules dynamically
    function renderModules() {
        contentModulesContainer.innerHTML = '';
        
        moduleData.forEach(moduleInfo => {
            const moduleElement = createModuleElement(moduleInfo);
            contentModulesContainer.appendChild(moduleElement);
        });
        
        // Update references after rendering
        modules = document.querySelectorAll('.content-module');
    }
    
    // Create individual module element
    function createModuleElement(moduleInfo) {
        const module = document.createElement('div');
        module.className = 'content-module';
        module.dataset.moduleId = moduleInfo.id;
        
        const topicsHTML = moduleInfo.topics.map(topic => `
            <li class="module-topic">
                <svg class="topic-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                ${topic.title}
            </li>
        `).join('');
        
        module.innerHTML = `
            <div class="module-header">
                <div class="module-number">${moduleInfo.number}</div>
                <h3 class="module-title">${moduleInfo.title}</h3>
            </div>
            <p class="module-description">
                ${moduleInfo.description}
            </p>
            <ul class="module-topics">
                ${topicsHTML}
            </ul>
        `;
        
        return module;
    }
    
    // Setup module animations
    function setupModuleAnimations() {
        const moduleObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    moduleObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Initialize module animations
        modules.forEach(module => {
            module.style.opacity = '0';
            module.style.transform = 'translateY(30px)';
            module.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            moduleObserver.observe(module);
        });
    }
    
    // Counter animation for content stats
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/\D/g, ''));
            const suffix = stat.textContent.replace(/\d/g, '');
            let current = 0;
            const increment = target / 60;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + suffix;
                }
            }, 25);
        });
    }
    
    // Intersection Observer for stats animation
    const statsSection = document.querySelector('.content-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });
        
        statsObserver.observe(statsSection);
    }
});