// ================================
// PARALLAX EFFECT FOR HERO SECTION
// Diplomado Neural Networks
// ================================

document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero');
    
    if (!heroSection) {
        console.warn('Hero section not found for parallax effect');
        return;
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
        opacity: 0.5;
    `;
    
    // Create SVG element for parallax
    const parallaxSvg = document.createElement('div');
    parallaxSvg.className = 'parallax-svg';
    parallaxSvg.style.cssText = `
        position: absolute;
        top: -40%;
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
    
    // Insert parallax container as the first child of hero section
    heroSection.insertBefore(parallaxContainer, heroSection.firstChild);
    
    // Parallax scroll effect
    let ticking = false;
    
    function updateParallax() {
        const scrollY = window.scrollY;
        const heroRect = heroSection.getBoundingClientRect();
        const heroHeight = heroSection.offsetHeight;
        
        // Only apply parallax when hero section is visible
        if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
            // Calculate parallax offset (moves slower than scroll)
            const parallaxSpeed = 0.7;
            const yPos = scrollY * parallaxSpeed;
            
            // Apply transform with 3D acceleration
            parallaxSvg.style.transform = `translate3d(0, ${yPos}px, 0) scale(1.1)`;
        }
        
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
    
    console.log('Parallax effect initialized for hero section');
});