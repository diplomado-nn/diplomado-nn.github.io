// ================================
// PARALLAX EFFECT FOR HERO SECTION
// Diplomado Neural Networks
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Function to create parallax effect for a section
    function initParallaxSection(selector, opacity = 0.5, speed = 0.7, position=-40) {
        const section = document.querySelector(selector);
        
        if (!section) {
            console.warn(`Section ${selector} not found for parallax effect`);
            return null;
        }
        
        // Create parallax background container
        const parallaxContainer = document.createElement('div');
        parallaxContainer.className = 'parallax-background';
        parallaxContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 120%;
            z-index: 0;
            pointer-events: none;
            overflow: hidden;
            opacity: ${opacity};
        `;
        
        // Create SVG element for parallax
        const parallaxSvg = document.createElement('div');
        parallaxSvg.className = 'parallax-svg';
        parallaxSvg.style.cssText = `
            position: absolute;
            top: ${position}%;
            left: -10%;
            width: 120%;
            height: 120%;
            background-image: url('./assets/parallax/paralax.svg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            transform: translateZ(0);
            will-change: transform;
        `;
        
        // Append elements
        parallaxContainer.appendChild(parallaxSvg);
        
        // Insert parallax container as the first child of section
        // Special handling for philosophy section structure
        if (selector === '.philosophy-section') {
            const philosophyBg = section.querySelector('.philosophy-background');
            if (philosophyBg) {
                philosophyBg.insertBefore(parallaxContainer, philosophyBg.firstChild);
            } else {
                section.insertBefore(parallaxContainer, section.firstChild);
            }
        } else {
            section.insertBefore(parallaxContainer, section.firstChild);
        }
        
        return { section, parallaxSvg, speed };
    }
    
    // Initialize parallax for multiple sections
    const parallaxSections = [
        initParallaxSection('.hero', 0.5, 0.7, -40),
        initParallaxSection('.testimonials', 0.3, 0.7, -160),
    ].filter(Boolean); // Remove null entries
    
    if (parallaxSections.length === 0) {
        console.warn('No sections found for parallax effect');
        return;
    }
    
    // Parallax scroll effect
    let ticking = false;
    
    function updateParallax() {
        const scrollY = window.scrollY;
        
        parallaxSections.forEach(({ section, parallaxSvg, speed }) => {
            const sectionRect = section.getBoundingClientRect();
            
            // Only apply parallax when section is visible
            if (sectionRect.bottom > 0 && sectionRect.top < window.innerHeight) {
                // Calculate parallax offset (moves slower than scroll)
                const yPos = scrollY * speed;
                
                // Apply transform with 3D acceleration
                parallaxSvg.style.transform = `translate3d(0, ${yPos}px, 0) scale(1.1)`;
            }
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    // Listen to scroll events with passive option for better performance
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initialize parallax position
    updateParallax();
    
    // Handle window resize
    function handleResize() {
        // Reset position on resize
        updateParallax();
    }
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    console.log(`Parallax effect initialized for ${parallaxSections.length} sections`);
});