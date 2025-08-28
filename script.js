// Mark JS-enabled for CSS fallbacks
document.documentElement.classList.add('js');

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = Array.from(document.querySelectorAll('.nav-menu .nav-link'));
    const themeToggles = Array.from(document.querySelectorAll('.theme-toggle'));

    if (navToggle && navMenu) {
        const overlay = document.getElementById('navOverlay');
        const BREAKPOINT = 992;
        // Helper to set ARIA states
        function setMenuState(open) {
            navMenu.classList.toggle('active', open);
            navToggle.classList.toggle('active', open);
            if (overlay) overlay.classList.toggle('show', open);
            document.body.classList.toggle('no-scroll', open);
            navToggle.setAttribute('aria-expanded', String(open));
            navMenu.setAttribute('aria-hidden', String(!open));
            // Rely on CSS transitions; clear any inline overrides
            navMenu.style.display = '';
            navMenu.style.pointerEvents = '';
        }

        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const willOpen = !navMenu.classList.contains('active');
            setMenuState(willOpen);
        });

        // Keyboard support for toggle
        navToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const willOpen = !navMenu.classList.contains('active');
                setMenuState(willOpen);
            } else if (e.key === 'Escape') {
                setMenuState(false);
            }
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                setMenuState(false);
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                setMenuState(false);
            }
        });

        // Close menu when tapping overlay
        if (overlay) {
            overlay.addEventListener('click', () => {
                setMenuState(false);
            });
        }

        // Close menu and prevent odd auto-animations when crossing breakpoints
        // keep in sync with setMenuState
        // BREAKPOINT is defined above
        let lastIsMobile = window.innerWidth <= BREAKPOINT;

        window.addEventListener('resize', () => {
            const isMobile = window.innerWidth <= BREAKPOINT;
            if (isMobile !== lastIsMobile) {
                // Temporarily disable transitions to avoid slide flicker
                navMenu.classList.add('no-transition');
                // Ensure menu is closed and toggle reset when breakpoint changes
                setMenuState(false);
                // Allow layout to settle, then re-enable transitions
                setTimeout(() => {
                    navMenu.classList.remove('no-transition');
                }, 50);
            }
            lastIsMobile = isMobile;
        });
        // Initialize ARIA states
        setMenuState(false);
    }

    // Defer interactive map on mobile to avoid scroll jank
    try {
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        const mapWrapper = document.querySelector('.map-placeholder');
        const mapIframe = mapWrapper ? mapWrapper.querySelector('iframe') : null;
        if (isMobile && mapWrapper && mapIframe) {
            const src = mapIframe.getAttribute('src');
            mapWrapper.dataset.mapSrc = src;
            mapIframe.remove();
            const btn = document.createElement('button');
            btn.className = 'load-map-btn';
            btn.type = 'button';
            btn.textContent = 'Load Map';
            btn.setAttribute('aria-label', 'Load interactive map');
            mapWrapper.appendChild(btn);
            btn.addEventListener('click', () => {
                const iframe = document.createElement('iframe');
                iframe.src = mapWrapper.dataset.mapSrc || src;
                iframe.setAttribute('width', '100%');
                iframe.setAttribute('style', 'border:0; border-radius: 10px;');
                iframe.setAttribute('allowfullscreen', '');
                iframe.setAttribute('loading', 'eager');
                iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
                iframe.setAttribute('title', 'Daniel\'s Coffee & More Location - 1050 3rd Ave, New York, NY 10065');
                mapWrapper.innerHTML = '';
                mapWrapper.appendChild(iframe);
            });
        }
    } catch (e) { /* noop */ }

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
    if (savedTheme === 'dark') rootEl.setAttribute('data-theme', 'dark');

    function toggleTheme(btn) {
        const isDark = rootEl.getAttribute('data-theme') === 'dark';
        if (isDark) {
            rootEl.removeAttribute('data-theme');
            localStorage.removeItem('theme');
        } else {
            rootEl.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        if (btn) {
            btn.classList.add('twist');
            setTimeout(() => btn.classList.remove('twist'), 250);
        }
    }

    if (themeToggles.length) {
        themeToggles.forEach(btn => btn.addEventListener('click', () => toggleTheme(btn)));
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
        
        // Submit the form (replace with actual submission logic)
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
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll('.animate-on-scroll');
    if (isMobile || reduceMotion) {
        // Show immediately on mobile/reduced motion
        targets.forEach(el => el.classList.add('animate'));
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    targets.forEach(el => observer.observe(el));
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    // Keep navbar stable; only optional shadow after small scroll
    if (window.scrollY > 100) {
        navbar.style.background = '#4A2C2A';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
        navbar.classList.add('scrolled');
    } else {
        navbar.style.background = '#4A2C2A';
        navbar.style.boxShadow = 'none';
        navbar.classList.remove('scrolled');
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
    
    // Remove scroll-hide behavior; navbar always visible
    
    // Hero background: prefer strawb video; fallback to image if unsupported
    try {
        const hero = document.querySelector('.hero');
        const video = document.getElementById('heroVideo');
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)');

        // No poster: show video immediately
        function showPoster() { /* no-op */ }
        function showVideo() { /* no-op */ }

        if (!video) return;

        // Try to play immediately

        // Try to play; only hide poster when we know the video can play
        showPoster();
        let ready = false;
        const onCanPlay = () => { if (!ready) { ready = true; showVideo(); } };
        video.addEventListener('canplay', onCanPlay, { once: true });
        video.addEventListener('playing', onCanPlay, { once: true });
        video.addEventListener('error', () => { showPoster(); });

        const attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(() => showPoster());
        }

        // Safety timeout: if not ready after 2s, keep poster
        setTimeout(() => { if (!ready) showPoster(); }, 2000);

        // React to prefers-reduced-motion changes
        mql.addEventListener('change', (e) => { if (e.matches) showPoster(); else video.play(); });
    } catch (e) { /* no-op */ }

});
