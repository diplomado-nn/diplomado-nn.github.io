// Simple parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxBg = document.getElementById('parallaxBg');
    const parallaxBg2 = document.getElementById('parallaxBg2');
    
    // Simple parallax movement
    if (parallaxBg) parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    if (parallaxBg2) parallaxBg2.style.transform = `translateY(${scrolled * 0.5}px)`;
});