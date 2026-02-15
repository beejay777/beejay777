/**
 * Mobile Experience Modal
 * On small screens, hides job bullets and adds "Show details" buttons
 * that open a fullscreen modal with the full description.
 */
(function () {
    const MQ = 768;
    const modal = document.getElementById('exp-modal');
    if (!modal) return;

    const modalTitle = modal.querySelector('.exp-modal-title');
    const modalCompany = modal.querySelector('.exp-modal-company');
    const modalPeriod = modal.querySelector('.exp-modal-period');
    const modalList = modal.querySelector('.exp-modal-list');
    const modalClose = modal.querySelector('.exp-modal-close');

    function isMobile() {
        return window.innerWidth <= MQ;
    }

    // Inject "Show details" buttons into each timeline item
    function injectButtons() {
        document.querySelectorAll('.timeline-item').forEach((item) => {
            if (item.querySelector('.show-details-btn')) return; // already injected
            const btn = document.createElement('button');
            btn.className = 'show-details-btn';
            btn.innerHTML = 'Show details <i class="fas fa-chevron-right"></i>';
            btn.addEventListener('click', () => openModal(item));
            item.querySelector('.timeline-content').appendChild(btn);
        });
    }

    function openModal(item) {
        const title = item.querySelector('.job-title').textContent;
        const company = item.querySelector('.company').textContent;
        const period = item.querySelector('.job-period').textContent;
        const bullets = item.querySelectorAll('.job-description li');

        modalTitle.textContent = title;
        modalCompany.textContent = company;
        modalPeriod.textContent = period;
        modalList.innerHTML = '';
        bullets.forEach((li) => {
            const clone = document.createElement('li');
            clone.textContent = li.textContent;
            modalList.appendChild(clone);
        });

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    injectButtons();
})();
