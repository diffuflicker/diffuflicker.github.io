// DiffuFlicker Project Page - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Auto-play videos when in viewport
    const videos = document.querySelectorAll('video[autoplay]');
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play();
            } else {
                entry.target.pause();
            }
        });
    }, { threshold: 0.5 });

    videos.forEach(video => videoObserver.observe(video));

    // Copy citation to clipboard
    const bibtex = document.querySelector('.bibtex pre');
    if (bibtex) {
        bibtex.style.cursor = 'pointer';
        bibtex.title = 'Click to copy';

        bibtex.addEventListener('click', function() {
            navigator.clipboard.writeText(this.textContent.trim()).then(() => {
                // Show feedback
                const originalBg = this.parentElement.style.background;
                this.parentElement.style.background = '#2d4a3e';
                setTimeout(() => {
                    this.parentElement.style.background = originalBg;
                }, 300);
            });
        });
    }
});
