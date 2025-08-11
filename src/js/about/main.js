/* ================================
   ABOUT PAGE MAIN FUNCTIONALITY
   Diplomado Neural Networks
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize neural pattern animations
    initNeuralPatterns();
});

// ===== SCROLL ANIMATIONS ===== 
function initScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements with animations
    const animatedElements = document.querySelectorAll([
        '.philosophy-header',
        '.philosophy-problem',
        '.philosophy-vision',
        '.philosophy-commitment'
    ].join(','));
    
    animatedElements.forEach(element => {
        if (element) {
            observer.observe(element);
        }
    });
}

// ===== NEURAL PATTERN ANIMATIONS =====
function initNeuralPatterns() {
    const neuralPattern = document.querySelector('.neural-pattern');
    
    if (neuralPattern) {
        // Add hover effect to neural pattern
        neuralPattern.addEventListener('mouseenter', () => {
            neuralPattern.style.animationDuration = '1s';
        });
        
        neuralPattern.addEventListener('mouseleave', () => {
            neuralPattern.style.animationDuration = '3s';
        });
        
        // Add click effect to vision cards
        const visionCards = document.querySelectorAll('.vision-card');
        visionCards.forEach(card => {
            card.addEventListener('click', () => {
                card.style.transform = 'translateY(-12px) scale(1.02)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
            });
        });
    }
}

// ===== SMOOTH SCROLLING FOR INTERNAL LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle scroll events for better performance
function throttle(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}