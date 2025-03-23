/**
 * Subtle Torchlight Animation
 * A lightweight effect that creates a subtle glow around the cursor
 */

document.addEventListener('DOMContentLoaded', function() {
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
    
    // Resize canvas to fill window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Track mouse position
    let mouseX = -100; // Start off-screen
    let mouseY = -100;
    
    // Torchlight properties
    const torchlight = {
        radius: 500,      // Large size of the glow effect
        intensity: 0.2,  // Constant brightness of the glow
        color: '#78A0FF', // Lighter blue color
    };
    
    // Draw the torchlight effect
    function drawTorchlight() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Only draw if mouse is on screen
        if (mouseX > 0 && mouseY > 0) {
            // Create radial gradient for the glow
            const gradient = ctx.createRadialGradient(
                mouseX, mouseY, 0,
                mouseX, mouseY, torchlight.radius
            );
            
            // Use a constant brightness - no fading
            const alpha = torchlight.intensity;
            
            // Use a lighter version of the background blue
            gradient.addColorStop(0, `rgba(120, 160, 255, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(80, 120, 200, ${alpha * 0.5})`);
            gradient.addColorStop(1, 'rgba(10, 25, 47, 0)');
            
            // Draw the glow
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, torchlight.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        // Continue animation
        requestAnimationFrame(drawTorchlight);
    }
    
    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    
    document.addEventListener('mousemove', function(e) {
        // Update mouse position
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Handle mouse leaving the window
    document.addEventListener('mouseleave', function() {
        // Move cursor off-screen when mouse leaves
        mouseX = -100;
        mouseY = -100;
    });
    
    // Touch events for mobile
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 0) {
            // Update "mouse" position based on touch
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function() {
        // Hide when touch ends
        mouseX = -100;
        mouseY = -100;
    });
    
    // Initialize
    resizeCanvas();
    drawTorchlight();
});
