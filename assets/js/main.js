document.addEventListener('DOMContentLoaded', function() {
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

    const videos = document.querySelectorAll('video');
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.currentTime = 0;
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.3 });

    videos.forEach(video => {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        videoObserver.observe(video);
    });

    function initThumbnailGallery() {
        const wrapper = document.querySelector('.thumbnail-gallery-wrapper');
        const gallery = document.querySelector('.thumbnail-gallery');
        const thumbnails = document.querySelectorAll('.thumbnail-item');
        const mainVideo = document.getElementById('main-video');
        const captionEl = document.getElementById('video-caption');
        const prevBtn = document.querySelector('.thumb-prev');
        const nextBtn = document.querySelector('.thumb-next');

        if (!mainVideo || thumbnails.length === 0 || !gallery || !wrapper) return;

        let currentIndex = 0;
        let scrollIndex = 0;
        const visibleCount = 5;
        const itemWidth = 110;

        function updateFadeIndicators() {
            if (scrollIndex > 0) {
                wrapper.classList.add('has-prev');
            } else {
                wrapper.classList.remove('has-prev');
            }

            if (scrollIndex < thumbnails.length - visibleCount) {
                wrapper.classList.add('has-next');
            } else {
                wrapper.classList.remove('has-next');
            }
        }

        function updateGalleryScroll() {
            const offset = scrollIndex * itemWidth;
            gallery.scrollTo({ left: offset, behavior: 'smooth' });
            updateFadeIndicators();
        }

        function selectVideo(index) {
            if (index < 0 || index >= thumbnails.length) return;
            currentIndex = index;

            const thumb = thumbnails[index];
            const videoSrc = thumb.getAttribute('data-video');
            const caption = thumb.getAttribute('data-caption');

            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');

            mainVideo.src = videoSrc;
            mainVideo.load();
            mainVideo.play().catch(() => {});

            if (captionEl && caption) {
                captionEl.innerHTML = caption;
            }

            if (currentIndex < scrollIndex) {
                scrollIndex = currentIndex;
                updateGalleryScroll();
            } else if (currentIndex >= scrollIndex + visibleCount) {
                scrollIndex = currentIndex - visibleCount + 1;
                updateGalleryScroll();
            }
        }

        function goToPrev() {
            if (currentIndex > 0) {
                selectVideo(currentIndex - 1);
            }
        }

        function goToNext() {
            if (currentIndex < thumbnails.length - 1) {
                selectVideo(currentIndex + 1);
            }
        }

        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => selectVideo(index));
        });

        if (prevBtn) {
            prevBtn.addEventListener('click', goToPrev);
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', goToNext);
        }

        updateFadeIndicators();
    }

    initThumbnailGallery();

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

    const bibtex = document.querySelector('.bibtex pre');
    if (bibtex) {
        bibtex.style.cursor = 'pointer';
        bibtex.title = 'Click to copy';

        bibtex.addEventListener('click', function() {
            navigator.clipboard.writeText(this.textContent.trim()).then(() => {
                const originalBg = this.parentElement.style.background;
                this.parentElement.style.background = '#3d5a4e';
                setTimeout(() => {
                    this.parentElement.style.background = originalBg;
                }, 500);
            });
        });
    }
});
