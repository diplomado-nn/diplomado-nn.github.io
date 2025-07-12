// Simple parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxBg = document.getElementById('parallaxBg');
    const parallaxBg2 = document.getElementById('parallaxBg2');
    
    // Simple parallax movement
    if (parallaxBg) parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    if (parallaxBg2) parallaxBg2.style.transform = `translateY(${scrolled * 0.5}px)`;
});

// Load FAQ data and render
async function loadFAQ() {
    try {
        const response = await fetch('data/FAQ.json');
        const data = await response.json();
        renderFAQ(data.faqs);
    } catch (error) {
        console.error('Error loading FAQ data:', error);
    }
}

// Render FAQ items
function renderFAQ(faqs) {
    const faqContainer = document.querySelector('.faq-container');
    if (!faqContainer) return;
    
    faqContainer.innerHTML = '';
    
    faqs.forEach(faq => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        
        faqItem.innerHTML = `
            <button class="faq-question" onclick="toggleFAQ(this)">
                <span>${faq.question}</span>
                <span class="faq-icon">+</span>
            </button>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        `;
        
        faqContainer.appendChild(faqItem);
    });
}

// FAQ accordion functionality
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const faqAnswer = faqItem.querySelector('.faq-answer');
    const faqIcon = button.querySelector('.faq-icon');
    const isOpen = faqItem.classList.contains('active');
    
    // Close all other FAQ items
    const allFaqItems = document.querySelectorAll('.faq-item');
    allFaqItems.forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            const otherAnswer = item.querySelector('.faq-answer');
            const otherIcon = item.querySelector('.faq-icon');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
            if (otherIcon) otherIcon.textContent = '+';
        }
    });
    
    // Toggle current FAQ item
    if (isOpen) {
        faqItem.classList.remove('active');
        faqAnswer.style.maxHeight = '0';
        faqIcon.textContent = '+';
    } else {
        faqItem.classList.add('active');
        faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
        faqIcon.textContent = '−';
    }
}

// Load FAQ when DOM is ready
document.addEventListener('DOMContentLoaded', loadFAQ);