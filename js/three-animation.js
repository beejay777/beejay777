// Three.js Torchlight Mouse Animation for Portfolio Website

// Create a class for the animation to encapsulate all functionality
class TorchlightAnimation {
    constructor() {
        // Initialize properties
        this.container = document.body;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouseX = this.width / 2;
        this.mouseY = this.height / 2;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.light = null;
        this.particles = [];
        this.animationId = null;
        this.isInitialized = false;
        this.bloomPass = null;
        this.composer = null;

        // Bind methods
        this.init = this.init.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.animate = this.animate.bind(this);
        this.createParticles = this.createParticles.bind(this);

        // Initialize the animation
        this.init();
    }

    init() {
        try {
            // Create canvas container
            this.canvas = document.createElement('canvas');
            this.canvas.classList.add('threejs-bg');
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.pointerEvents = 'none'; // Make sure it doesn't interfere with clicks
            this.canvas.style.zIndex = '0'; // Put it behind content but above background
            document.body.prepend(this.canvas);

            // Initialize Three.js components
            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                alpha: true
            });
            this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
            this.renderer.setSize(this.width, this.height);
            this.renderer.setClearColor(0x000000, 0); // Transparent background

            // Create scene
            this.scene = new THREE.Scene();

            // Create camera
            this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 1000);
            this.camera.position.set(0, 0, 150);

            // Create light (spotlight for torch effect)
            this.light = new THREE.PointLight(0xFF9000, 5, 100);
            this.light.position.set(0, 0, 30);
            this.scene.add(this.light);

            // Add ambient light for subtle background illumination
            const ambientLight = new THREE.AmbientLight(0x111111, 0.1);
            this.scene.add(ambientLight);

            // Create particles for a more interesting torchlight effect
            this.createParticles();

            // Add event listeners
            window.addEventListener('resize', this.handleResize);
            window.addEventListener('mousemove', this.handleMouseMove);
            
            // Start animation loop
            this.animate();
            this.isInitialized = true;
            
            console.log("Three.js torchlight animation initialized successfully");
        } catch (error) {
            console.error("Failed to initialize Three.js torchlight animation:", error);
        }
    }

    createParticles() {
        // Create particles in a grid pattern
        const particleCount = 2000;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const colors = new Float32Array(particleCount * 3);
        
        // Create grid of particles across the viewport with some randomness
        let i = 0;
        for (let x = -this.width / 2; x < this.width / 2; x += 30) {
            for (let y = -this.height / 2; y < this.height / 2; y += 30) {
                if (i < particleCount) {
                    // Position with slight randomness
                    positions[i * 3] = x + (Math.random() - 0.5) * 20;
                    positions[i * 3 + 1] = y + (Math.random() - 0.5) * 20;
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // Z-depth variation
                    
                    // Random default size (small)
                    sizes[i] = Math.random() * 1.5 + 0.5;
                    
                    // Color with slight variation (orange)
                    colors[i * 3] = 1.0;       // R (full)
                    colors[i * 3 + 1] = 0.5 + Math.random() * 0.2;  // G (about half)
                    colors[i * 3 + 2] = Math.random() * 0.1;  // B (very little)
                    
                    i++;
                }
            }
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Vertex shader for custom point rendering
        const vertexShader = `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;

        // Fragment shader for glowing particles
        const fragmentShader = `
            varying vec3 vColor;
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5, 0.5));
                if (dist > 0.5) discard;
                float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
                gl_FragColor = vec4(vColor, alpha);
            }
        `;

        // Create shader material
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
        });

        // Create the particle system
        const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particleSystem);
        this.particles.push({
            system: particleSystem,
            positions: positions,
            sizes: sizes,
            colors: colors
        });
    }

    handleResize() {
        // Update dimensions
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Update camera
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(this.width, this.height);
    }

    handleMouseMove(event) {
        // Get mouse position
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    animate() {
        // Continue animation loop
        this.animationId = requestAnimationFrame(this.animate);

        // Convert mouse coordinates to scene coordinates
        const mouseX = this.mouseX - this.width / 2;
        const mouseY = -(this.mouseY - this.height / 2);
        
        // Move light to follow mouse with subtle lag for a smoother effect
        this.light.position.x += (mouseX - this.light.position.x) * 0.1;
        this.light.position.y += (mouseY - this.light.position.y) * 0.1;
        
        // Update particles based on light proximity
        this.particles.forEach(particle => {
            const positions = particle.positions;
            const sizes = particle.sizes;
            const colors = particle.colors;
            const geometry = particle.system.geometry;
            
            for (let i = 0; i < positions.length / 3; i++) {
                const x = positions[i * 3];
                const y = positions[i * 3 + 1];
                
                // Calculate distance from light
                const dx = x - this.light.position.x;
                const dy = y - this.light.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Adjust particle size based on distance to light (torchlight effect)
                // Close particles are larger
                if (distance < 80) {
                    const scale = 1 - distance / 80;
                    sizes[i] = 0.5 + 4 * scale * scale;
                    
                    // Make colors more intense near the light
                    colors[i * 3 + 1] = 0.5 + 0.5 * scale; // G
                    colors[i * 3 + 2] = 0.2 * scale;  // B
                } else {
                    // Distant particles are smaller and fade out
                    sizes[i] *= 0.99;
                    if (sizes[i] < 0.5) sizes[i] = 0.5;
                    
                    // Reset colors for distant particles
                    colors[i * 3 + 1] = 0.5;
                    colors[i * 3 + 2] = 0;
                }
            }
            
            // Update geometry attributes
            geometry.attributes.size.needsUpdate = true;
            geometry.attributes.color.needsUpdate = true;
        });

        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }

    // Clean up method for removing animation
    destroy() {
        if (!this.isInitialized) return;
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('mousemove', this.handleMouseMove);
        
        // Stop animation loop
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Remove canvas
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        // Clear Three.js resources
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.light = null;
        this.particles = [];
        
        this.isInitialized = false;
    }
}

// Initialize the animation when DOM is loaded
let torchlightAnimation;

// Wait for DOM and Three.js to be fully loaded
window.addEventListener('load', () => {
    // Small delay to ensure everything is ready
    setTimeout(() => {
        // Check if Three.js is available
        if (typeof THREE !== 'undefined') {
            console.log("Starting Three.js torchlight animation");
            torchlightAnimation = new TorchlightAnimation();
        } else {
            console.error("Three.js is not loaded");
        }
    }, 500);
});
