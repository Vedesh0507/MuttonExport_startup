/* ============================================
   FRESHFLOW FOODS - MAIN JAVASCRIPT
   Version: 1.1.0
   Author: Freshflow Foods Development Team
   Updated: Responsive & Performance Optimizations
   ============================================ */

/**
 * Utility: Debounce function to limit how often a function fires
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * DOM Content Loaded Event
 * Initialize all components when the DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initHeader();
    initMobileMenu();
    initDropdowns();
    initHeroSwiper();
    initSmoothScroll();
    initScrollAnimations();
    initBreedCardsAnimation();
    initContactForm();
    initResponsiveHandlers();
});

/**
 * Initialize responsive event handlers with debouncing
 */
function initResponsiveHandlers() {
    // Debounced resize handler
    const handleResize = debounce(function() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 991) {
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Reset any open dropdowns
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(function(dropdown) {
                dropdown.classList.remove('active');
            });
        }
    }, 150);
    
    window.addEventListener('resize', handleResize);
}

/* ============================================
   HEADER / NAVIGATION
   ============================================ */

/**
 * Initialize header scroll behavior
 * Adds 'scrolled' class when page is scrolled
 */
function initHeader() {
    const header = document.getElementById('header');
    
    if (!header) return;
    
    // Check scroll position on load
    checkHeaderScroll();
    
    // Check scroll position on scroll
    window.addEventListener('scroll', checkHeaderScroll);
    
    function checkHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!navToggle || !navMenu) return;
    
    // Toggle menu on button click
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Initialize dropdown menus for mobile
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(function(dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (!toggle) return;
        
        // Mobile: Toggle dropdown on click
        toggle.addEventListener('click', function(e) {
            // Only prevent default on mobile
            if (window.innerWidth <= 991) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(function(other) {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Reset dropdowns on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991) {
            dropdowns.forEach(function(dropdown) {
                dropdown.classList.remove('active');
            });
        }
    });
}

/* ============================================
   HERO SWIPER CAROUSEL
   ============================================ */

/**
 * Initialize Swiper for hero section
 */
function initHeroSwiper() {
    const heroSwiper = document.querySelector('.hero-swiper');
    
    if (!heroSwiper) return;
    
    // Check if Swiper is available
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper library not loaded');
        return;
    }
    
    // Initialize Swiper
    new Swiper('.hero-swiper', {
        // Basic settings
        loop: true,
        speed: 800,
        
        // Autoplay
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        
        // Effect
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        // Keyboard control
        keyboard: {
            enabled: true,
        },
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */

/**
 * Initialize smooth scroll for anchor links
 */
function initSmoothScroll() {
    // Get all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#" or empty
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Get header height for offset
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Calculate scroll position
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (animatedElements.length === 0) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Immediately show all elements without animation
        animatedElements.forEach(function(element) {
            element.classList.add('animated');
        });
        return;
    }
    
    // Create Intersection Observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Add delay based on index for staggered animations
                const delay = entry.target.dataset.delay || 0;
                
                setTimeout(function() {
                    entry.target.classList.add('animated');
                }, delay);
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });
    
    // Observe all animated elements
    animatedElements.forEach(function(element, index) {
        // Add staggered delay for elements in the same section
        if (!element.dataset.delay) {
            element.dataset.delay = index % 6 * 100;
        }
        observer.observe(element);
    });
}

/* ============================================
   BREED CARDS ANIMATION
   ============================================ */

/**
 * Initialize breed cards fade-up animation with stagger effect
 */
function initBreedCardsAnimation() {
    const breedCards = document.querySelectorAll('.breed-card');
    const regionCards = document.querySelectorAll('.region-card');
    
    // Combine both card types
    const allCards = [...breedCards, ...regionCards];
    
    if (allCards.length === 0) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Immediately show all cards without animation
        allCards.forEach(function(card) {
            card.classList.add('animate-in');
        });
        return;
    }
    
    // Create Intersection Observer for breed cards
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Add animate-in class to trigger CSS animation
                entry.target.classList.add('animate-in');
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    });
    
    // Observe all cards
    allCards.forEach(function(card) {
        observer.observe(card);
    });
}

/* ============================================
   CONTACT FORM VALIDATION
   ============================================ */

/**
 * Initialize contact form validation
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetForm');
    const submitBtn = document.getElementById('submitBtn');
    
    // Form fields
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    
    /**
     * Validate email format
     * @param {string} email - Email address to validate
     * @returns {boolean} - True if valid
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Show error message for a field
     * @param {HTMLElement} input - Input element
     * @param {HTMLElement} errorEl - Error message element
     * @param {string} message - Error message
     */
    function showError(input, errorEl, message) {
        input.classList.add('error');
        if (errorEl) {
            errorEl.textContent = message;
        }
    }
    
    /**
     * Clear error message for a field
     * @param {HTMLElement} input - Input element
     * @param {HTMLElement} errorEl - Error message element
     */
    function clearError(input, errorEl) {
        input.classList.remove('error');
        if (errorEl) {
            errorEl.textContent = '';
        }
    }
    
    /**
     * Validate a single field
     * @param {HTMLElement} input - Input element
     * @param {HTMLElement} errorEl - Error message element
     * @param {string} type - Validation type
     * @returns {boolean} - True if valid
     */
    function validateField(input, errorEl, type) {
        const value = input.value.trim();
        
        // Clear previous error
        clearError(input, errorEl);
        
        // Check if empty (for required fields)
        if (!value) {
            showError(input, errorEl, 'This field is required.');
            return false;
        }
        
        // Additional validation based on type
        switch (type) {
            case 'email':
                if (!isValidEmail(value)) {
                    showError(input, errorEl, 'Please enter a valid email address.');
                    return false;
                }
                break;
            case 'name':
                if (value.length < 2) {
                    showError(input, errorEl, 'Name must be at least 2 characters.');
                    return false;
                }
                break;
            case 'message':
                if (value.length < 10) {
                    showError(input, errorEl, 'Message must be at least 10 characters.');
                    return false;
                }
                break;
        }
        
        return true;
    }
    
    // Real-time validation on blur
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            validateField(this, nameError, 'name');
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateField(this, emailError, 'email');
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('blur', function() {
            validateField(this, messageError, 'message');
        });
    }
    
    // Clear error on input
    [nameInput, emailInput, messageInput].forEach(function(input) {
        if (input) {
            input.addEventListener('input', function() {
                this.classList.remove('error');
            });
        }
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = validateField(nameInput, nameError, 'name');
        const isEmailValid = validateField(emailInput, emailError, 'email');
        const isMessageValid = validateField(messageInput, messageError, 'message');
        
        // If all valid, submit form
        if (isNameValid && isEmailValid && isMessageValid) {
            // Show loading state
            if (submitBtn) {
                submitBtn.querySelector('.btn-text').style.display = 'none';
                submitBtn.querySelector('.btn-loading').style.display = 'inline';
                submitBtn.disabled = true;
            }
            
            // Gather form data
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: document.getElementById('phone')?.value.trim() || 'Not provided',
                subject: document.getElementById('subject')?.value || 'General Inquiry',
                message: messageInput.value.trim()
            };
            
            // Get subject label
            const subjectSelect = document.getElementById('subject');
            const subjectLabel = subjectSelect ? subjectSelect.options[subjectSelect.selectedIndex].text : 'General Inquiry';
            
            // Build message for WhatsApp
            const whatsappMessage = `*New Enquiry – Freshflow Foods*%0A%0A*Name:* ${encodeURIComponent(formData.name)}%0A*Email:* ${encodeURIComponent(formData.email)}%0A*Phone:* ${encodeURIComponent(formData.phone)}%0A*Subject:* ${encodeURIComponent(subjectLabel)}%0A%0A*Message:*%0A${encodeURIComponent(formData.message)}%0A%0A_Sent from Freshflow Foods website contact form._`;
            
            // Build message for Email
            const emailSubject = encodeURIComponent(`New Enquiry – Freshflow Foods: ${subjectLabel}`);
            const emailBody = encodeURIComponent(`New Enquiry – Freshflow Foods\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSubject: ${subjectLabel}\n\nMessage:\n${formData.message}\n\n---\nSent from Freshflow Foods website contact form.`);
            
            // WhatsApp URL
            const whatsappUrl = `https://wa.me/917794084488?text=${whatsappMessage}`;
            
            // Email URL (mailto)
            const mailtoUrl = `mailto:freshflowfoods@gmail.com?subject=${emailSubject}&body=${emailBody}`;
            
            // Simulate brief processing delay
            setTimeout(function() {
                // Open WhatsApp in new tab
                window.open(whatsappUrl, '_blank');
                
                // Also trigger email client (backup method)
                // Using a hidden anchor to avoid popup blockers
                const emailLink = document.createElement('a');
                emailLink.href = mailtoUrl;
                emailLink.style.display = 'none';
                document.body.appendChild(emailLink);
                
                // Hide form, show success message
                contactForm.style.display = 'none';
                if (formSuccess) {
                    formSuccess.style.display = 'block';
                }
                
                // Reset button state
                if (submitBtn) {
                    submitBtn.querySelector('.btn-text').style.display = 'inline';
                    submitBtn.querySelector('.btn-loading').style.display = 'none';
                    submitBtn.disabled = false;
                }
                
                // Log form data (for demonstration)
                console.log('Form submitted:', formData);
                console.log('WhatsApp URL:', whatsappUrl);
            }, 1000);
        }
    });
    
    // Reset form button
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', function() {
            // Reset form
            contactForm.reset();
            
            // Clear all errors
            [nameInput, emailInput, messageInput].forEach(function(input) {
                if (input) {
                    input.classList.remove('error');
                }
            });
            [nameError, emailError, messageError].forEach(function(errorEl) {
                if (errorEl) {
                    errorEl.textContent = '';
                }
            });
            
            // Show form, hide success message
            contactForm.style.display = 'block';
            if (formSuccess) {
                formSuccess.style.display = 'none';
            }
        });
    }
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between calls
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(function() {
                inThrottle = false;
            }, limit);
        }
    };
}

/* ============================================
   ACTIVE NAVIGATION HIGHLIGHTING
   ============================================ */

/**
 * Update active navigation link based on scroll position
 */
(function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0) return;
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId || 
                        link.getAttribute('href').endsWith('#' + sectionId)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateActiveNav, 100));
})();

/* ============================================
   LAZY LOADING IMAGES
   ============================================ */

/**
 * Initialize lazy loading for images
 */
(function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length === 0) return;
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without Intersection Observer
        lazyImages.forEach(function(img) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
})();

/* ============================================
   BACK TO TOP BUTTON (Optional Enhancement)
   ============================================ */

/**
 * Initialize back to top button functionality
 */
(function() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();

/* ============================================
   PRELOADER (Optional Enhancement)
   ============================================ */

/**
 * Hide preloader when page is fully loaded
 */
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        preloader.classList.add('loaded');
        
        // Remove from DOM after animation
        setTimeout(function() {
            preloader.remove();
        }, 500);
    }
});
