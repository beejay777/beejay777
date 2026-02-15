/**
 * Dual Theme Particle System
 * Supports both Modern (torchlight) and Retro (star field) effects
 */

document.addEventListener('DOMContentLoaded', function () {
    // Get the canvas element
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    // Canvas setup
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';

    // Current theme mode
    let currentMode = 'modern';

    // Resize canvas to fill window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Regenerate stars on resize
        if (currentMode === 'retro') {
            generateStars();
        }
    }

    // Track mouse position
    let mouseX = -100;
    let mouseY = -100;

    // ==========================================
    // MODERN THEME - Torchlight Effect
    // ==========================================
    const torchlight = {
        radius: 550,
        intensity: 0.35,
        color: '#ffffff',
    };

    function drawModernEffect() {
        if (currentMode !== 'modern') return;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Only draw if mouse is on screen
        if (mouseX > 0 && mouseY > 0) {
            // Create radial gradient for the glow
            const gradient = ctx.createRadialGradient(
                mouseX, mouseY, 0,
                mouseX, mouseY, torchlight.radius
            );

            const alpha = torchlight.intensity;

            // Pure bright white torch light - clean illumination
            gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
            gradient.addColorStop(0.25, `rgba(255, 255, 255, ${alpha * 0.6})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.3})`);
            gradient.addColorStop(1, 'rgba(10, 25, 47, 0)');

            // Draw the glow
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, torchlight.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        requestAnimationFrame(drawModernEffect);
    }

    // ==========================================
    // RETRO THEME - Star Field Effect
    // ==========================================
    const stars = [];
    const numStars = 100; // Reduced for better performance
    let retroAnimationId = null;

    function generateStars() {
        stars.length = 0;
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.3 + 0.1,
                twinkle: Math.random() * Math.PI * 2,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                color: Math.random() > 0.7
                    ? '#00FFFF'
                    : Math.random() > 0.5
                        ? '#FF00FF'
                        : '#00FF00'
            });
        }
    }

    function drawRetroEffect() {
        if (currentMode !== 'retro') {
            if (retroAnimationId) {
                cancelAnimationFrame(retroAnimationId);
                retroAnimationId = null;
            }
            return;
        }

        // Semi-transparent dark blue for trail effect
        ctx.fillStyle = 'rgba(0, 0, 51, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw and update stars
        ctx.save();
        stars.forEach(star => {
            // Update twinkle
            star.twinkle += star.twinkleSpeed;
            const brightness = 0.5 + Math.sin(star.twinkle) * 0.5;

            // Move star slowly
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }

            // Draw star with glow
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * brightness, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = star.color;
            ctx.fill();
        });
        ctx.restore();

        // Update shooting star if active
        if (shootingStar && shootingStar.life > 0) {
            updateShootingStar();
        }

        // Draw occasional shooting star
        if (Math.random() < 0.003 && (!shootingStar || shootingStar.life <= 0)) {
            createShootingStar();
        }

        retroAnimationId = requestAnimationFrame(drawRetroEffect);
    }

    let shootingStar = null;

    function createShootingStar() {
        shootingStar = {
            x: Math.random() * canvas.width * 0.6,
            y: Math.random() * canvas.height * 0.3,
            length: 60 + Math.random() * 30,
            speed: 10 + Math.random() * 8,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
            life: 1
        };
    }

    function updateShootingStar() {
        if (!shootingStar || shootingStar.life <= 0) return;

        const endX = shootingStar.x + Math.cos(shootingStar.angle) * shootingStar.length;
        const endY = shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length;

        const gradient = ctx.createLinearGradient(
            shootingStar.x, shootingStar.y, endX, endY
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.life})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.life -= 0.02;
    }

    // ==========================================
    // THEME SWITCHING
    // ==========================================
    let modernAnimationId = null;

    function setTheme(theme) {
        // Cancel existing animations to prevent memory leaks
        if (retroAnimationId) {
            cancelAnimationFrame(retroAnimationId);
            retroAnimationId = null;
        }
        if (modernAnimationId) {
            cancelAnimationFrame(modernAnimationId);
            modernAnimationId = null;
        }

        currentMode = theme;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'block';

        if (theme === 'retro') {
            generateStars();
            shootingStar = null;
            drawRetroEffect();
        } else {
            drawModernEffect();
        }
    }

    // Listen for theme changes
    window.addEventListener('themechange', function (e) {
        setTheme(e.detail.theme);
    });

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', function () {
        mouseX = -100;
        mouseY = -100;
    });

    document.addEventListener('touchmove', function (e) {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    }, { passive: true });

    document.addEventListener('touchend', function () {
        mouseX = -100;
        mouseY = -100;
    });

    // ==========================================
    // INITIALIZATION
    // ==========================================
    resizeCanvas();

    // Check initial theme from html class
    if (document.documentElement.classList.contains('theme-retro')) {
        setTheme('retro');
    } else {
        setTheme('modern');
    }

    // Export for external access
    window.retroStarField = {
        activate: () => setTheme('retro'),
        deactivate: () => setTheme('modern')
    };
});
