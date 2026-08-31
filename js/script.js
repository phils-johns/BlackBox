/**
 * Phils-Johns Digital Agence
 * Main JavaScript file for interactivity, animations, and tracking
 */

// ============================================
// 1. MOBILE MENU TOGGLE
// ============================================

const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ============================================
// 2. GLASS CARD LIQUID EFFECT (Mouse tracking)
// ============================================

const glassCards = document.querySelectorAll('.glass-card, .product-card');

glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate percentage for pseudo-element positioning
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;

        // Set CSS variables for the radial gradient effect
        card.style.setProperty('--mouse-x', `${percentX}%`);
        card.style.setProperty('--mouse-y', `${percentY}%`);
    });

    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
    });
});

// ============================================
// 3. SCROLL REVEAL ANIMATION
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// ============================================
// 4. CONTACT FORM HANDLING
// ============================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async(e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            timestamp: new Date().toISOString()
        };

        // Log to console (in production, send to backend)
        console.log('Contact Form Submission:', data);

        // Show success message
        showSuccessMessage(contactForm);

        // Reset form
        contactForm.reset();
    });
}

function showSuccessMessage(form) {
    // Create success message
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #00d9ff, #ff006e);
        color: #000;
        padding: 1.5rem 2rem;
        border-radius: 16px;
        font-weight: 700;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 8px 32px rgba(0, 217, 255, 0.3);
    `;
    successMsg.textContent = '✓ Message envoyé avec succès !';
    document.body.appendChild(successMsg);

    // Remove after 4 seconds
    setTimeout(() => {
        successMsg.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => successMsg.remove(), 300);
    }, 4000);
}

// Add animation styles for success message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// 5. SMOOTH SCROLL HANDLING FOR ANCHORS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ============================================
// 6. ANALYTICS TRACKING (Simplified)
// ============================================

// Simple page view tracking
function trackPageView() {
    const event = {
        type: 'pageview',
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        referrer: document.referrer
    };
    console.log('Analytics:', event);

    // In production, send to Vercel Analytics or custom backend
    // fetch('/api/analytics', { method: 'POST', body: JSON.stringify(event) });
}

// Track page views on load
window.addEventListener('load', () => {
    trackPageView();
});

// ============================================
// 7. LINK CLICK TRACKING
// ============================================

document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href) {
        const clickEvent = {
            type: 'click',
            target: e.target.href,
            text: e.target.textContent,
            timestamp: new Date().toISOString()
        };
        console.log('Link Click:', clickEvent);

        // In production: send to analytics service
    }
});

// ============================================
// 8. PRODUCT LINK TRACKING
// ============================================

document.querySelectorAll('.product-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const productName = link.closest('.product-card').querySelector('.product-name').textContent;
        const productPrice = link.closest('.product-card').querySelector('.product-price').textContent;

        const productEvent = {
            type: 'product_click',
            product: productName,
            price: productPrice,
            timestamp: new Date().toISOString()
        };
        console.log('Product Click:', productEvent);
    });
});

// ============================================
// 9. SMOOTH PARALLAX BACKGROUND
// ============================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('body::before');

    // Subtle parallax effect on background
    if (document.body.style.backgroundAttachment !== 'fixed') {
        // For browsers that don't support fixed backgrounds
        const elements = document.querySelectorAll('.hero::before, .hero::after');
        elements.forEach((el, i) => {
            el.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }
});

// ============================================
// 10. LAZY LOAD IMAGES (if used)
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// 11. ACTIVE NAV LINK INDICATOR
// ============================================

function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.style.color = 'var(--accent-primary)';
        } else {
            link.style.color = 'var(--text-primary)';
        }
    });
}

updateActiveNavLink();

// ============================================
// 12. FORM INPUT FOCUS EFFECTS
// ============================================

document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.style.background = 'rgba(255, 255, 255, 0.1)';
    });

    input.addEventListener('blur', function() {
        this.style.background = 'rgba(255, 255, 255, 0.05)';
    });
});

// ============================================
// 13. PERFORMANCE: DEBOUNCE MOUSEMOVE
// ============================================

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

// ============================================
// 14. INITIALIZE ON DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Phils-Johns Digital Agence - Site loaded successfully');
    console.log('Liquid Glass effects enabled');
    console.log('Analytics tracking active');
    // Apply saved theme or default to night
    const savedTheme = localStorage.getItem('phils_theme') || 'theme-night';
    document.documentElement.classList.add(savedTheme);
    // Setup theme toggles (support multiple buttons per page)
    const themeToggles = document.querySelectorAll('.theme-toggle');

    function updateToggleIcons(theme) {
        themeToggles.forEach(btn => {
            btn.textContent = theme === 'theme-night' ? '🌙' : '☀️';
            btn.setAttribute('aria-pressed', theme === 'theme-day');
        });
    }

    updateToggleIcons(savedTheme);

    themeToggles.forEach(themeToggle => {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.classList.contains('theme-night') ? 'theme-night' : 'theme-day';
            const next = current === 'theme-night' ? 'theme-day' : 'theme-night';
            document.documentElement.classList.remove(current);
            document.documentElement.classList.add(next);
            localStorage.setItem('phils_theme', next);
            updateToggleIcons(next);
        });
    });
});

// ============================================
// 15. ACCESSIBILITY: KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape key
    if (e.key === 'Escape' && hamburger) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

console.log('%c🚀 Phils-Johns Digital Agence', 'font-size: 16px; font-weight: bold; color: #00d9ff;');
console.log('%cLiquid Glass Design - Minimaliste et Épuré', 'font-size: 12px; color: #b0b0b0;');