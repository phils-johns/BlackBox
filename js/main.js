const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
        const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', String(!isOpen));
        menuButton.setAttribute('aria-label', isOpen ? 'Ouvrir le menu' : 'Fermer le menu');
        navigation.classList.toggle('is-open', !isOpen);
    });

    navigation.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            menuButton.setAttribute('aria-expanded', 'false');
            navigation.classList.remove('is-open');
        });
    });
}

const revealItems = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}

const filterButtons = document.querySelectorAll('[data-filter]');
const portfolioItems = document.querySelectorAll('[data-category]');

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach((filterButton) => {
            filterButton.setAttribute('aria-pressed', String(filterButton === button));
        });

        portfolioItems.forEach((item) => {
            item.hidden = selectedFilter !== 'all' && item.dataset.category !== selectedFilter;
        });
    });
});

const contactForm = document.querySelector('#contactForm');

if (contactForm) {
    const formStatus = contactForm.querySelector('[data-form-status]');

    contactForm.addEventListener('submit', (event) => {
        if (!contactForm.checkValidity()) {
            event.preventDefault();
            contactForm.reportValidity();

            if (formStatus) {
                formStatus.textContent = 'Vérifiez les champs indiqués avant l’envoi.';
                formStatus.classList.add('is-error');
            }
            return;
        }

        if (formStatus) {
            formStatus.textContent = 'Envoi en cours…';
            formStatus.classList.remove('is-error');
        }
    });
}

const metricValues = {
    projectsDelivered: null,
    creationYear: 2023,
    responseHours: null
};

function showMetric(element) {
    const value = metricValues[element.dataset.counter];

    if (!Number.isFinite(value)) {
        element.textContent = 'À renseigner';
        return;
    }

    const duration = 1200;
    const startTime = performance.now();
    const animate = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        element.textContent = Math.round(value * easedProgress).toLocaleString('fr-FR');

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.textContent = value.toLocaleString('fr-FR');
        return;
    }

    requestAnimationFrame(animate);
}

const counters = document.querySelectorAll('[data-counter]');

if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                showMetric(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach((counter) => counterObserver.observe(counter));
} else {
    counters.forEach(showMetric);
}

const newsletterForm = document.querySelector('#newsletterForm');

if (newsletterForm) {
    const newsletterStatus = newsletterForm.querySelector('[data-newsletter-status]');

    newsletterForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!newsletterForm.checkValidity()) {
            newsletterForm.reportValidity();
            newsletterStatus.textContent = 'Saisissez une adresse email valide.';
            newsletterStatus.classList.add('is-error');
            return;
        }

        newsletterStatus.textContent = 'Adresse vérifiée. Le service d’inscription sera activé après connexion de la newsletter.';
        newsletterStatus.classList.remove('is-error');
    });
}

const whatsappLink = document.createElement('a');
whatsappLink.className = 'whatsapp-float';
whatsappLink.href = 'https://wa.me/22879905677?text=Bonjour%20Phil-Johns%20Digital%2C%20je%20souhaite%20parler%20d%E2%80%99un%20projet.';
whatsappLink.target = '_blank';
whatsappLink.rel = 'noopener noreferrer';
whatsappLink.setAttribute('aria-label', 'Contacter Phil-Johns Digital sur WhatsApp');
whatsappLink.innerHTML = '<span aria-hidden="true">WA</span>';
document.body.append(whatsappLink);