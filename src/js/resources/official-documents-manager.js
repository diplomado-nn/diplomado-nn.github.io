/* ================================
   OFFICIAL DOCUMENTS MANAGER
   Diplomado Neural Networks
   ================================ */

class OfficialDocumentsManager {
    constructor() {
        this.documentsData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadDocumentsData();
            this.renderOfficialDocuments();
        } catch (error) {
            console.error('Error initializing official documents:', error);
        }
    }

    async loadDocumentsData() {
        try {
            const response = await fetch('./../../src/data/administrative-docs.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.documentsData = await response.json();
        } catch (error) {
            console.error('Error loading documents data:', error);
            throw error;
        }
    }

    renderOfficialDocuments() {
        const container = document.querySelector('.official-documents-content');
        if (!container || !this.documentsData) return;

        container.innerHTML = `
            ${this.renderDocumentsGrid()}
        `;
    }

    renderDocumentsGrid() {
        const { documents } = this.documentsData;
        
        return `
            <div class="documents-grid">
                ${documents.map(doc => this.renderDocumentCard(doc)).join('')}
            </div>
        `;
    }

    renderDocumentCard(document) {
        const icon = this.getDocumentIcon(document.type);
        
        return `
            <div class="document-card">
                <div class="document-header">
                    <div class="document-icon">${icon}</div>
                    <div class="document-info">
                        <h3>${document.title}</h3>
                        <span class="document-type">${document.size}</span>
                    </div>
                </div>
                
                <p class="document-description">${document.description}</p>
                
                <div class="document-actions">
                    <a href="${document.path}" 
                       class="document-btn document-btn-primary" 
                       download="${document.filename}"
                       rel="noopener noreferrer">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                        Descargar
                    </a>
                    <a href="${document.path}" 
                       class="document-btn document-btn-secondary" 
                       target="_blank"
                       rel="noopener noreferrer">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                        </svg>
                        Vista Previa
                    </a>
                </div>
            </div>
        `;
    }

    getDocumentIcon(type) {
        const icons = {
            'academic': '📄',
            'administrative': '📋',
            'form': '📝',
            'certificate': '🏆'
        };
        return icons[type] || '📄';
    }

}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OfficialDocumentsManager();
});