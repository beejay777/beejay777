/**
 * Retro Theme Effects
 * Creates nostalgic 90s web effects for the retro theme
 */

class RetroEffects {
    constructor() {
        this.isActive = false;
        this.hitCounter = 0;
        this.blinkingElements = [];
        this.marqueeElements = [];
        this.cursorTrail = [];

        // Listen for theme changes
        window.addEventListener('themechange', (e) => {
            if (e.detail.theme === 'retro') {
                this.activate();
            } else {
                this.deactivate();
            }
        });

        // Check initial theme
        if (document.documentElement.classList.contains('theme-retro')) {
            this.activate();
        }
    }

    activate() {
        if (this.isActive) return;
        this.isActive = true;

        this.createScanlines();
        this.createCRTEffect();
        this.initHitCounter();
        this.initBlinkingText();
        this.initPixelCursor();
        this.initStarField();
    }

    deactivate() {
        if (!this.isActive) return;
        this.isActive = false;

        this.removeScanlines();
        this.removeCRTEffect();
        this.removeHitCounter();
        this.removeBlinkingText();
        this.removePixelCursor();
        this.removeStarField();
    }

    createScanlines() {
        if (document.querySelector('.retro-scanlines')) return;

        const scanlines = document.createElement('div');
        scanlines.className = 'retro-scanlines';
        scanlines.innerHTML = '';
        document.body.appendChild(scanlines);
    }

    removeScanlines() {
        const scanlines = document.querySelector('.retro-scanlines');
        if (scanlines) scanlines.remove();
    }

    createCRTEffect() {
        if (document.querySelector('.retro-crt')) return;

        const crt = document.createElement('div');
        crt.className = 'retro-crt';
        document.body.appendChild(crt);
    }

    removeCRTEffect() {
        const crt = document.querySelector('.retro-crt');
        if (crt) crt.remove();
    }

    initHitCounter() {
        const counter = document.querySelector('.hit-counter');
        if (!counter) return;

        // Get saved count or start fresh
        let count = parseInt(localStorage.getItem('retro-hits') || '1337');
        count++;
        localStorage.setItem('retro-hits', count.toString());

        // Animate the counter
        this.animateCounter(counter, count);
    }

    animateCounter(element, targetCount) {
        const digits = targetCount.toString().padStart(6, '0');
        element.innerHTML = '';

        digits.split('').forEach((digit, index) => {
            const digitEl = document.createElement('span');
            digitEl.className = 'counter-digit';
            digitEl.textContent = '0';
            digitEl.style.animationDelay = `${index * 100}ms`;
            element.appendChild(digitEl);

            setTimeout(() => {
                digitEl.textContent = digit;
            }, 500 + index * 100);
        });
    }

    removeHitCounter() {
        // Hit counter stays in DOM but stops animating
    }

    initBlinkingText() {
        // Add blink class to specific elements when in retro mode
        const elementsToAnimate = document.querySelectorAll('.highlight, .job-period');

        elementsToAnimate.forEach(el => {
            if (!el.classList.contains('retro-blink')) {
                el.classList.add('retro-blink');
                this.blinkingElements.push(el);
            }
        });
    }

    removeBlinkingText() {
        this.blinkingElements.forEach(el => {
            el.classList.remove('retro-blink');
        });
        this.blinkingElements = [];
    }

    initPixelCursor() {
        document.body.classList.add('retro-cursor');
    }

    removePixelCursor() {
        document.body.classList.remove('retro-cursor');
    }

    initStarField() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas || !window.retroStarField) return;

        window.retroStarField.activate();
    }

    removeStarField() {
        if (window.retroStarField) {
            window.retroStarField.deactivate();
        }
    }
}

// Initialize retro effects
const retroEffects = new RetroEffects();
window.retroEffects = retroEffects;
