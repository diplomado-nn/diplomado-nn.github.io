// ================================
// FAQ SECTION - NEURAL NETWORK THEME
// Diplomado Neural Networks
// ================================

document.addEventListener('DOMContentLoaded', function() {
    initializeFAQSection();
});

async function initializeFAQSection() {
    try {
        const response = await fetch('src/data/faq-data.json');
        const data = await response.json();
        renderFAQs(data.faqs);
        setupFAQAccordion();
    } catch (error) {
        console.error('Error loading FAQ data:', error);
    }
}

function renderFAQs(faqs) {
    const faqContent = document.querySelector('.faq-content');
    
    if (!faqContent) {
        console.error('FAQ content container not found');
        return;
    }

    const faqHTML = faqs.map(faq => createFAQItem(faq)).join('');
    faqContent.innerHTML = faqHTML;
}

function createFAQItem(faq) {
    return `
        <div class="faq-item" data-faq-id="${faq.id}">
            <button class="faq-question">
                <span>${faq.question}</span>
                <div class="faq-icon">+</div>
            </button>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        </div>
    `;
}

function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = null;
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}