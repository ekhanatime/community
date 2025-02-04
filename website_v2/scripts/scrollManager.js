// Scroll and Parallax Management
document.addEventListener('DOMContentLoaded', () => {
    const starField = document.querySelector('.star-field');
    const narrativeContainer = document.querySelector('.narrative-container');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        
        // Parallax star field
        starField.style.transform = `translateY(${scrollPosition * 0.3}px)`;
        
        // Subtle narrative container movement
        narrativeContainer.style.transform = `translateY(${scrollPosition * 0.1}px) rotateX(${scrollPosition * 0.05}deg)`;
        
        // Fade effect for tribe cards
        const tribeCards = document.querySelectorAll('.tribe-card');
        tribeCards.forEach((card, index) => {
            card.style.opacity = 1 - (scrollPosition * 0.005 * (index + 1));
        });
    });

    // Cosmic breathing animation for narrative container
    function cosmicPulse() {
        narrativeContainer.style.transform = `scale(${1 + Math.sin(Date.now() * 0.001) * 0.02})`;
        requestAnimationFrame(cosmicPulse);
    }
    cosmicPulse();
});
