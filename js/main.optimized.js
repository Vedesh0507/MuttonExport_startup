/* ============================================
   FRESHFLOW FOODS - OPTIMIZED JAVASCRIPT
   Version: 2.0.0 - Performance Optimized
   ============================================ */

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================
   CRITICAL - Run Immediately for Core Functionality
   ============================================ */

// Header scroll behavior (critical for UX)
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    const checkScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };
    
    checkScroll();
    window.addEventListener('scroll', throttle(checkScroll, 100), { passive: true });
}

// Mobile menu (critical for navigation)
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close on link click
    navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Dropdowns
function initDropdowns() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (!toggle) return;
        
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                document.querySelectorAll('.dropdown').forEach(other => {
                    if (other !== dropdown) other.classList.remove('active');
                });
            }
        });
    });
}

// Run critical functions immediately when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initHeader();
        initMobileMenu();
        initDropdowns();
    });
} else {
    initHeader();
    initMobileMenu();
    initDropdowns();
}

/* ============================================
   DEFERRED - Initialize After First Paint
   ============================================ */

/**
 * Initialize Swiper after first paint for better LCP
 * Uses requestIdleCallback for non-blocking initialization
 */
function initHeroSwiperDeferred() {
    const heroSwiper = document.querySelector('.hero-swiper');
    if (!heroSwiper || typeof Swiper === 'undefined') return;
    
    // Initialize Swiper with optimized settings
    new Swiper('.hero-swiper', {
        loop: true,
        speed: 800,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        keyboard: {
            enabled: true,
        },
        // Performance optimizations
        watchSlidesProgress: true,
        preloadImages: false,
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 1,
        },
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, href);
            }
        });
    });
}

/**
 * Scroll-triggered animations with IntersectionObserver
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    if (elements.length === 0) return;
    
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        elements.forEach(el => el.classList.add('animated'));
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => entry.target.classList.add('animated'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });
    
    elements.forEach((el, index) => {
        if (!el.dataset.delay) el.dataset.delay = (index % 6) * 100;
        observer.observe(el);
    });
}

/**
 * Breed cards animation
 */
function initBreedCardsAnimation() {
    const cards = [...document.querySelectorAll('.breed-card'), ...document.querySelectorAll('.region-card')];
    if (cards.length === 0) return;
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cards.forEach(card => card.classList.add('animate-in'));
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    });
    
    cards.forEach(card => observer.observe(card));
}

/**
 * Contact form validation
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const formSuccess = document.getElementById('formSuccess');
    const resetBtn = document.getElementById('resetForm');
    const submitBtn = document.getElementById('submitBtn');
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    const showError = (input, errorEl, message) => {
        input.classList.add('error');
        if (errorEl) errorEl.textContent = message;
    };
    
    const clearError = (input, errorEl) => {
        input.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
    };
    
    const validateField = (input, errorEl, type) => {
        const value = input.value.trim();
        clearError(input, errorEl);
        
        if (!value) {
            showError(input, errorEl, 'This field is required.');
            return false;
        }
        
        if (type === 'email' && !isValidEmail(value)) {
            showError(input, errorEl, 'Please enter a valid email address.');
            return false;
        }
        if (type === 'name' && value.length < 2) {
            showError(input, errorEl, 'Name must be at least 2 characters.');
            return false;
        }
        if (type === 'message' && value.length < 10) {
            showError(input, errorEl, 'Message must be at least 10 characters.');
            return false;
        }
        
        return true;
    };
    
    // Real-time validation
    if (nameInput) nameInput.addEventListener('blur', () => validateField(nameInput, nameError, 'name'));
    if (emailInput) emailInput.addEventListener('blur', () => validateField(emailInput, emailError, 'email'));
    if (messageInput) messageInput.addEventListener('blur', () => validateField(messageInput, messageError, 'message'));
    
    [nameInput, emailInput, messageInput].forEach(input => {
        if (input) input.addEventListener('input', () => input.classList.remove('error'));
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isNameValid = validateField(nameInput, nameError, 'name');
        const isEmailValid = validateField(emailInput, emailError, 'email');
        const isMessageValid = validateField(messageInput, messageError, 'message');
        
        if (isNameValid && isEmailValid && isMessageValid) {
            if (submitBtn) {
                submitBtn.querySelector('.btn-text').style.display = 'none';
                submitBtn.querySelector('.btn-loading').style.display = 'inline';
                submitBtn.disabled = true;
            }
            
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: document.getElementById('phone')?.value.trim() || 'Not provided',
                subject: document.getElementById('subject')?.value || 'General Inquiry',
                message: messageInput.value.trim()
            };
            
            const subjectSelect = document.getElementById('subject');
            const subjectLabel = subjectSelect ? subjectSelect.options[subjectSelect.selectedIndex].text : 'General Inquiry';
            
            const whatsappMessage = `*New Enquiry – Freshflow Foods*%0A%0A*Name:* ${encodeURIComponent(formData.name)}%0A*Email:* ${encodeURIComponent(formData.email)}%0A*Phone:* ${encodeURIComponent(formData.phone)}%0A*Subject:* ${encodeURIComponent(subjectLabel)}%0A%0A*Message:*%0A${encodeURIComponent(formData.message)}%0A%0A_Sent from Freshflow Foods website contact form._`;
            const whatsappUrl = `https://wa.me/917794084488?text=${whatsappMessage}`;
            
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                form.style.display = 'none';
                if (formSuccess) formSuccess.style.display = 'block';
                
                if (submitBtn) {
                    submitBtn.querySelector('.btn-text').style.display = 'inline';
                    submitBtn.querySelector('.btn-loading').style.display = 'none';
                    submitBtn.disabled = false;
                }
            }, 1000);
        }
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            form.reset();
            [nameInput, emailInput, messageInput].forEach(input => input?.classList.remove('error'));
            [nameError, emailError, messageError].forEach(el => { if (el) el.textContent = ''; });
            form.style.display = 'block';
            if (formSuccess) formSuccess.style.display = 'none';
        });
    }
}

/**
 * Active navigation highlighting
 */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (sections.length === 0) return;
    
    const updateActiveNav = () => {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId || 
                        link.getAttribute('href').endsWith('#' + sectionId)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    
    window.addEventListener('scroll', throttle(updateActiveNav, 100), { passive: true });
}

/**
 * Back to top button
 */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    
    window.addEventListener('scroll', throttle(() => {
        btn.classList.toggle('visible', window.scrollY > 500);
    }, 100), { passive: true });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Responsive handlers
 */
function initResponsiveHandlers() {
    const handleResize = debounce(() => {
        if (window.innerWidth > 991) {
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        }
    }, 150);
    
    window.addEventListener('resize', handleResize, { passive: true });
}

/* ============================================
   DEFERRED INITIALIZATION
   Uses requestIdleCallback or setTimeout fallback
   ============================================ */

function deferInit(callback) {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 2000 });
    } else {
        setTimeout(callback, 100);
    }
}

// Initialize non-critical features after first paint
function initDeferredFeatures() {
    // Wait for first paint, then initialize Swiper
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // Initialize Swiper after two animation frames (ensures first paint)
            initHeroSwiperDeferred();
            
            // Initialize other non-critical features
            deferInit(() => {
                initSmoothScroll();
                initScrollAnimations();
                initBreedCardsAnimation();
                initContactForm();
                initActiveNav();
                initBackToTop();
                initResponsiveHandlers();
            });
        });
    });
}

// Start deferred initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDeferredFeatures);
} else {
    initDeferredFeatures();
}

/* ============================================
   PRELOADER (Remove when page loads)
   ============================================ */
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('loaded');
        setTimeout(() => preloader.remove(), 500);
    }
});
