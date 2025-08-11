// ================================
// HERO SECTION INTERACTIONS - NEURAL NETWORK THEME
// Diplomado Neural Networks
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for hero buttons (only for internal anchors)
    const heroButtons = document.querySelectorAll('.hero-btn');
    
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only prevent default and use smooth scroll for internal anchors (#)
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const header = document.getElementById('header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // Let external links work normally
        });
    });
    
    // Parallax effect for floating elements
    function handleScroll() {
        const scrollY = window.scrollY;
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.2);
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px) rotate(${scrollY * 0.1}deg)`;
        });
        
        // Subtle parallax for hero card
        const heroCard = document.querySelector('.hero-card');
        if (heroCard) {
            const yPos = -(scrollY * 0.3);
            heroCard.style.transform = `translateY(${yPos}px)`;
        }
    }
    
    // Throttled scroll listener for performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Counter animation for stats (skip elements with emojis)
    function animateCounters() {
        const counters = document.querySelectorAll('.hero-stat-number');
        
        counters.forEach(counter => {
            const text = counter.textContent;
            const target = parseInt(text.replace(/\D/g, ''));
            
            // Skip animation if no valid number is found (emojis)
            if (isNaN(target) || target === 0) {
                return;
            }
            
            const suffix = text.replace(/\d/g, '');
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }
            }, 30);
        });
    }
    
    // Intersection Observer for counter animation
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observer.observe(heroStats);
    }
});