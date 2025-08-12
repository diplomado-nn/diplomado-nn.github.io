// ================================
// PAYMENT SECTION INTERACTIONS - NEURAL NETWORK THEME
// Diplomado Neural Networks
// ================================

document.addEventListener('DOMContentLoaded', function() {
    initializePaymentSection();
});

function initializePaymentSection() {
    addCopyToClipboardFunctionality();
    addHoverEffects();
    addRegistrationLinkTracking();
}

function addCopyToClipboardFunctionality() {
    const detailItems = document.querySelectorAll('.detail-item');
    
    detailItems.forEach(item => {
        const detailValue = item.querySelector('.detail-value');
        if (detailValue) {
            item.style.cursor = 'pointer';
            item.setAttribute('title', 'Click para copiar');
            
            item.addEventListener('click', function() {
                const textToCopy = detailValue.textContent.trim();
                
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(textToCopy).then(function() {
                        showCopyFeedback(item, '¡Copiado!');
                    }).catch(function() {
                        fallbackCopyToClipboard(textToCopy, item);
                    });
                } else {
                    fallbackCopyToClipboard(textToCopy, item);
                }
            });
        }
    });
}

function fallbackCopyToClipboard(text, element) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback(element, '¡Copiado!');
    } catch (err) {
        showCopyFeedback(element, 'Error al copiar');
    } finally {
        document.body.removeChild(textArea);
    }
}

function showCopyFeedback(element, message) {
    const originalTitle = element.getAttribute('title');
    element.setAttribute('title', message);
    element.style.backgroundColor = 'var(--color-success-bg)';
    element.style.borderColor = 'var(--color-success)';
    
    setTimeout(() => {
        element.setAttribute('title', originalTitle || 'Click para copiar');
        element.style.backgroundColor = '';
        element.style.borderColor = '';
    }, 2000);
}

function addHoverEffects() {
    const priceTiers = document.querySelectorAll('.price-tier:not(.featured)');
    
    priceTiers.forEach(tier => {
        tier.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        tier.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

function addRegistrationLinkTracking() {
    const registrationLink = document.querySelector('.registration-link');
    
    if (registrationLink) {
        registrationLink.addEventListener('click', function(e) {
            // Track click for analytics if needed in the future
            console.log('Registration link clicked');
            
            // Add visual feedback
            this.style.color = 'var(--color-primary-dark)';
            
            setTimeout(() => {
                this.style.color = '';
            }, 1000);
        });
    }
}

function addScrollRevealEffect() {
    const paymentSection = document.querySelector('.payment');
    
    if (paymentSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('payment-visible');
                    
                    // Animate pricing tiers
                    const priceTiers = entry.target.querySelectorAll('.price-tier');
                    priceTiers.forEach((tier, index) => {
                        tier.style.animationDelay = `${index * 100}ms`;
                        tier.classList.add('tier-animate');
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observer.observe(paymentSection);
    }
}

// Initialize scroll reveal effect
document.addEventListener('DOMContentLoaded', function() {
    addScrollRevealEffect();
});