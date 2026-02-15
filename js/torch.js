/**
 * Torch / Spotlight Effect
 * Dims the page and creates a radial light that follows the cursor
 */
(function () {
    const overlay = document.getElementById('torch-overlay');
    if (!overlay) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    const ease = 0.15;

    function updateGradient() {
        overlay.style.background = `radial-gradient(circle 450px at ${currentX}px ${currentY}px, transparent 0%, rgba(0, 0, 0, 0.2) 100%)`;
    }

    function animate() {
        currentX += (mouseX - currentX) * ease;
        currentY += (mouseY - currentY) * ease;
        updateGradient();
        requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Hide effect on mobile / touch devices
    document.addEventListener('touchstart', () => {
        overlay.style.display = 'none';
    }, { once: true });

    updateGradient();
    requestAnimationFrame(animate);
})();
