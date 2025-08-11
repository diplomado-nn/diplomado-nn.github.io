// ================================
// HEADER INTERACTIONS - NEURAL NETWORK THEME
// Diplomado Neural Networks
// ================================

document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect for header
    let lastScrollY = window.scrollY;
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Smooth scroll and active link management
    function handleNavClick(e) {
        const targetHref = e.target.getAttribute('href');
        
        // If it's a page link (not a hash), allow default navigation
        if (!targetHref.startsWith('#')) {
            return;
        }
        
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to clicked link
        e.target.classList.add('active');
        
        // Get target section
        const targetSection = document.querySelector(targetHref);
        
        if (targetSection) {
            // Calculate offset for fixed header
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Set active link based on current scroll position
    function updateActiveLink() {
        // Only update active links if we're on the main page (has sections)
        const sections = ['hero', 'content', 'testimonials'];
        const hasMainSections = sections.some(id => document.getElementById(id));
        
        if (!hasMainSections) return;
        
        const scrollPosition = window.scrollY + header.offsetHeight + 100;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]);
            if (section && section.offsetTop <= scrollPosition) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`a[href="#${sections[i]}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
                break;
            }
        }
    }
    
    // Throttled scroll listener for active link updates
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateActiveLink);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initial call
    handleScroll();
    updateActiveLink();
});