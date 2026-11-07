const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
        const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', String(!isOpen));
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