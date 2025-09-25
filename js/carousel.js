// Carousel JavaScript for Rosary73 Website

let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

// Auto-play carousel
let autoPlayInterval;

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active from all indicators
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    
    // Ensure index is within bounds
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }
    
    // Show current slide
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
    resetAutoPlay();
}

function goToSlide(index) {
    showSlide(index);
    resetAutoPlay();
}

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000); // Change slide every 5 seconds
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

// Touch/Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

const carouselContainer = document.querySelector('.bead-carousel');

if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left, go to next slide
            changeSlide(1);
        } else {
            // Swiped right, go to previous slide
            changeSlide(-1);
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    }
});

// Pause auto-play when hovering over carousel
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        startAutoPlay();
    });
}

// Preload images for smooth transitions
function preloadImages() {
    const imageUrls = [
        'https://raw.githubusercontent.com/toespin/rosary73/main/assets/images/bead_start.png',
        'https://raw.githubusercontent.com/toespin/rosary73/main/assets/images/bead_participate.png',
        'https://raw.githubusercontent.com/toespin/rosary73/main/assets/images/bead_record.png',
        'https://raw.githubusercontent.com/toespin/rosary73/main/assets/images/bead_finished.png',
        'https://raw.githubusercontent.com/toespin/rosary73/main/assets/images/bead_group.png',
        'https://raw.githubusercontent.com/toespin/rosary73/main/assets/images/bead_gift.png',
        'https://raw.githubusercontent.com/toespin/rosary73/main/assets/images/bead_subscribe.png'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    showSlide(0);
    startAutoPlay();
    preloadImages();
    
    // Add smooth scroll behavior for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80; // Height of fixed navbar
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Add animation when carousel comes into view
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe the carousel container
const carouselElement = document.querySelector('.bead-carousel-container');
if (carouselElement) {
    carouselElement.style.opacity = '0';
    carouselElement.style.transform = 'translateY(30px)';
    carouselElement.style.transition = 'all 0.8s ease';
    observer.observe(carouselElement);
}