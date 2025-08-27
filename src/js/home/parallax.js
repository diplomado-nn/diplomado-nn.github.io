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
        
        // Determine correct path for parallax image
        const getParallaxImagePath = () => {
            const currentPath = window.location.pathname;
            if (currentPath.includes('/src/components/')) {
                return '../../assets/parallax/paralax.svg';
            }
            return 'assets/parallax/paralax.svg';
        };

        // Create SVG element for parallax
        const parallaxSvg = document.createElement('div');
        parallaxSvg.className = 'parallax-svg';
        parallaxSvg.style.cssText = `
            position: absolute;
            top: ${position}%;
            left: -10%;
            width: 120%;
            height: 120%;
            background-image: url('${getParallaxImagePath()}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            transform: translateZ(0);
            will-change: transform;
        `;
        
        // Append elements
        parallaxContainer.appendChild(parallaxSvg);
        section.insertBefore(parallaxContainer, section.firstChild);
        
        return { section, parallaxSvg, speed };
    }
    
    // Initialize parallax for multiple sections
    const parallaxSections = [
        initParallaxSection('.hero', 0.5, 0.7, -40),
        initParallaxSection('.testimonials', 0.3, 0.7, -160),
        initParallaxSection('.videos-section', 0.3, 0.7, -50)
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