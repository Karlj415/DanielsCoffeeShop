// Fix for mobile Chrome viewport height issues
function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set initial viewport height
setViewportHeight();

// Update on resize and orientation change
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = Array.from(document.querySelectorAll('.nav-menu .nav-link'));
    const themeToggle = document.getElementById('themeToggle');

    if (navToggle && navMenu) {
        const overlay = document.getElementById('navOverlay');
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const willOpen = !navMenu.classList.contains('active');
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            if (overlay) overlay.classList.toggle('show', willOpen);
            document.body.classList.toggle('no-scroll', willOpen);
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const overlay = document.getElementById('navOverlay');
                if (overlay) overlay.classList.remove('show');
                document.body.classList.remove('no-scroll');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const overlay = document.getElementById('navOverlay');
                if (overlay) overlay.classList.remove('show');
                document.body.classList.remove('no-scroll');
            }
        });

        // Close menu when tapping overlay
        if (overlay) {
            overlay.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                overlay.classList.remove('show');
                document.body.classList.remove('no-scroll');
            });
        }

        // Close menu and prevent odd auto-animations when crossing breakpoints
        const BREAKPOINT = 992;
        let lastIsMobile = window.innerWidth <= BREAKPOINT;

        window.addEventListener('resize', () => {
            const isMobile = window.innerWidth <= BREAKPOINT;
            if (isMobile !== lastIsMobile) {
                // Temporarily disable transitions to avoid slide flicker
                navMenu.classList.add('no-transition');
                // Ensure menu is closed and toggle reset when breakpoint changes
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const overlay = document.getElementById('navOverlay');
                if (overlay) overlay.classList.remove('show');
                document.body.classList.remove('no-scroll');
                // Allow layout to settle, then re-enable transitions
                setTimeout(() => {
                    navMenu.classList.remove('no-transition');
                }, 50);
            }
            lastIsMobile = isMobile;
        });
    }

    // Active nav link highlight on scroll
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const linkById = new Map(
        navLinks
            .filter(a => a.getAttribute('href') && a.getAttribute('href').startsWith('#'))
            .map(a => [a.getAttribute('href').slice(1), a])
    );

    function setActive(id) {
        navLinks.forEach(a => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        const link = linkById.get(id);
        if (link) { link.classList.add('active'); link.setAttribute('aria-current', 'page'); }
    }

    if (sections.length && linkById.size) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        }, {
            root: null,
            // Consider a section active when its top is 40% from viewport top
            rootMargin: '-40% 0px -55% 0px',
            threshold: 0.01
        });

        sections.forEach(sec => observer.observe(sec));
    }

    // Theme: load preference and toggle
    const rootEl = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        rootEl.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = rootEl.getAttribute('data-theme') === 'dark';
            if (isDark) {
                rootEl.removeAttribute('data-theme');
                localStorage.removeItem('theme');
            } else {
                rootEl.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
            // micro-interaction twist
            themeToggle.classList.add('twist');
            setTimeout(() => themeToggle.classList.remove('twist'), 250);
        });
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Newsletter Form Handling
const newsletterForm = document.getElementById('newsletterForm');
const formMessage = document.getElementById('form-message');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        
        // Basic validation
        if (!name || !email) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Submit the form (replace with your actual submission logic)
        submitNewsletter(name, email);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitNewsletter(name, email) {
    const submitBtn = document.querySelector('.submit-btn');
    
    // Show loading state
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate API call (replace with your actual API endpoint)
    setTimeout(() => {
        // Reset form
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        
        // Show success message
        showMessage('Thank you for subscribing to our newsletter!', 'success');
        
        // Reset button
        submitBtn.textContent = 'Subscribe';
        submitBtn.disabled = false;
    }, 2000);
}

function showMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Scroll animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const backToTop = document.getElementById('backToTop');
    if (!navbar) return;
    
    // Solid background + shadow after small scroll
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = '#4A2C2A';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
            navbar.classList.add('scrolled');
        } else {
            navbar.style.background = '#4A2C2A';
            navbar.style.boxShadow = 'none';
            navbar.classList.remove('scrolled');
        }
    }
    
    // Back-to-top toggle
    if (backToTop) {
        if (window.scrollY > 600) backToTop.classList.add('show');
        else backToTop.classList.remove('show');
    }
});

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    observeElements();
    
    // Show Instagram fallback posts immediately
    const loading = document.querySelector('.instagram-loading');
    const fallback = document.querySelector('.instagram-fallback');
    
    if (loading) {
        loading.style.display = 'none';
    }
    
    if (fallback) {
        fallback.style.display = 'grid';
    }
    
    // Scroll-up reveal/hide navbar
    let lastY = window.scrollY;
    const nav = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (!nav) return;
        if (y > lastY && y > 120) {
            // scrolling down
            nav.classList.add('nav-hidden');
        } else {
            // scrolling up
            nav.classList.remove('nav-hidden');
        }
        lastY = y;
    });
    
    // Back-to-top handler
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
