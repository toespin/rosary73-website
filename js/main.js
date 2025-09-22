// Rosary73 Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = this.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
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
                    
                    // Close mobile menu if open
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });
    
    // Intersection Observer for Scroll Animations
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .step, .pricing-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            observer.observe(element);
        });
    };
    
    // Initialize animations
    animateOnScroll();
    
    // Countdown Timer for Launch (Optional)
    const launchDate = new Date('2025-12-31T00:00:00').getTime();
    const countdownElement = document.getElementById('countdown');
    
    if (countdownElement) {
        const updateCountdown = function() {
            const now = new Date().getTime();
            const distance = launchDate - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                countdownElement.innerHTML = `
                    <div class="countdown-item">
                        <span class="countdown-value">${days}</span>
                        <span class="countdown-label">Days</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-value">${hours}</span>
                        <span class="countdown-label">Hours</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-value">${minutes}</span>
                        <span class="countdown-label">Minutes</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-value">${seconds}</span>
                        <span class="countdown-label">Seconds</span>
                    </div>
                `;
            } else {
                countdownElement.innerHTML = '<p>App is now available!</p>';
            }
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // Form Handling (for contact forms)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send this to a backend or service like Formspree
            console.log('Form submitted:', data);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.textContent = 'Thank you for your message! We\'ll get back to you soon.';
            this.appendChild(successMessage);
            
            // Reset form
            this.reset();
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        });
    }
    
    // Lazy Loading Images
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
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
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Testimonial Carousel (if you add testimonials)
    const initTestimonialCarousel = function() {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;
        
        const testimonials = carousel.querySelectorAll('.testimonial');
        let currentIndex = 0;
        
        const showTestimonial = (index) => {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.display = i === index ? 'block' : 'none';
                testimonial.style.opacity = i === index ? '1' : '0';
            });
        };
        
        const nextTestimonial = () => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        };
        
        const prevTestimonial = () => {
            currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentIndex);
        };
        
        // Auto-advance testimonials
        setInterval(nextTestimonial, 5000);
        
        // Add navigation buttons if they exist
        const nextBtn = carousel.querySelector('.carousel-next');
        const prevBtn = carousel.querySelector('.carousel-prev');
        
        if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
        if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
        
        // Initialize first testimonial
        showTestimonial(0);
    };
    
    initTestimonialCarousel();
    
    // FAQ Accordion
    const initFAQAccordion = function() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                question.addEventListener('click', function() {
                    // Close all other items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherAnswer = otherItem.querySelector('.faq-answer');
                            if (otherAnswer) {
                                otherAnswer.style.maxHeight = '0';
                            }
                        }
                    });
                    
                    // Toggle current item
                    item.classList.toggle('active');
                    
                    if (item.classList.contains('active')) {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    } else {
                        answer.style.maxHeight = '0';
                    }
                });
            }
        });
    };
    
    initFAQAccordion();
    
    // Performance optimization: Debounce scroll events
    let scrollTimeout;
    const debounceScroll = function(callback, wait) {
        return function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(callback, wait);
        };
    };
    
    // Track scroll for analytics (example)
    window.addEventListener('scroll', debounceScroll(function() {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        // You could send this to analytics
        if (scrollPercent > 25 && !window.tracked25) {
            console.log('User scrolled 25% of page');
            window.tracked25 = true;
        }
        if (scrollPercent > 50 && !window.tracked50) {
            console.log('User scrolled 50% of page');
            window.tracked50 = true;
        }
        if (scrollPercent > 75 && !window.tracked75) {
            console.log('User scrolled 75% of page');
            window.tracked75 = true;
        }
    }, 100));
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .alert {
        padding: 16px;
        border-radius: 8px;
        margin: 16px 0;
    }
    
    .alert-success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
`;
document.head.appendChild(style);
