/* ================================
   DOCUMENTATION FUNCTIONALITY
   Diplomado Neural Networks
   ================================ */

document.addEventListener('DOMContentLoaded', function() {
    const filters = document.querySelectorAll('.doc-filter');
    const docCards = document.querySelectorAll('.doc-card');
    
    // Filter functionality
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            const selectedLibrary = this.dataset.library;
            
            // Update active filter
            filters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            docCards.forEach(card => {
                const cardLibrary = card.dataset.library;
                
                if (selectedLibrary === 'all' || cardLibrary === selectedLibrary) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
});