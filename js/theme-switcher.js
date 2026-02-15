/**
 * Theme Switcher - Dual Theme Portfolio
 * Handles switching between Retro and Modern themes
 */

class ThemeSwitcher {
    constructor() {
        this.currentTheme = this.getSavedTheme() || 'modern';
        this.toggleBtn = null;
        this.isTransitioning = false;
        this.init();
    }

    init() {
        // Apply saved theme to HTML immediately (body might not exist yet)
        document.documentElement.classList.add(`theme-${this.currentTheme}`);

        // Wait for DOM to be ready for full setup
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupToggle();
                this.applyTheme(this.currentTheme, false);
            });
        } else {
            this.setupToggle();
            this.applyTheme(this.currentTheme, false);
        }
    }

    getSavedTheme() {
        try {
            return localStorage.getItem('portfolio-theme');
        } catch (e) {
            return null;
        }
    }

    saveTheme(theme) {
        try {
            localStorage.setItem('portfolio-theme', theme);
        } catch (e) {
            console.warn('Could not save theme preference');
        }
    }

    setupToggle() {
        this.toggleBtn = document.getElementById('theme-toggle');

        if (this.toggleBtn) {
            // Use event listener on the button inside, not the container
            const btn = this.toggleBtn.querySelector('.toggle-btn');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggle();
                });
            } else {
                // Fallback to container click
                this.toggleBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggle();
                });
            }
            this.updateToggleState();
        } else {
            console.warn('Theme toggle button not found');
        }

        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 't' && e.ctrlKey) {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    applyTheme(theme, animate = true) {
        const html = document.documentElement;

        if (animate && !this.isTransitioning) {
            this.isTransitioning = true;
            html.classList.add('theme-transitioning');

            // Create transition overlay
            this.createTransitionEffect(theme);

            setTimeout(() => {
                html.classList.remove('theme-transitioning');
                this.isTransitioning = false;
            }, 800);
        }

        // Remove existing theme classes
        html.classList.remove('theme-retro', 'theme-modern');

        // Add new theme class
        html.classList.add(`theme-${theme}`);

        // Update body attribute for CSS selectors (only if body exists)
        if (document.body) {
            document.body.setAttribute('data-theme', theme);
        }

        this.currentTheme = theme;
        this.saveTheme(theme);
        this.updateToggleState();

        // Dispatch custom event for other scripts to react
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme }
        }));

        console.log('Theme switched to:', theme);
    }

    createTransitionEffect(toTheme) {
        if (!document.body) return;

        const overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        overlay.setAttribute('data-to-theme', toTheme);

        document.body.appendChild(overlay);

        // Trigger animation
        requestAnimationFrame(() => {
            overlay.classList.add('active');
        });

        // Remove overlay after animation
        setTimeout(() => {
            overlay.remove();
        }, 800);
    }

    updateToggleState() {
        if (!this.toggleBtn) return;

        const isRetro = this.currentTheme === 'retro';
        this.toggleBtn.classList.toggle('retro-active', isRetro);
        this.toggleBtn.classList.toggle('modern-active', !isRetro);

        // Update aria label
        const label = isRetro
            ? 'Switch to Modern theme'
            : 'Switch to Retro theme';
        this.toggleBtn.setAttribute('aria-label', label);
    }

    toggle() {
        if (this.isTransitioning) return;

        const newTheme = this.currentTheme === 'retro' ? 'modern' : 'retro';
        console.log('Toggling theme from', this.currentTheme, 'to', newTheme);
        this.applyTheme(newTheme, true);
    }

    getTheme() {
        return this.currentTheme;
    }
}

// Initialize theme switcher
const themeSwitcher = new ThemeSwitcher();

// Export for use in other scripts
window.themeSwitcher = themeSwitcher;
