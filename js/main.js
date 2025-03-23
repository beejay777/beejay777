// Portfolio Website JavaScript
// Handles navigation, animations, and interactivity

document.addEventListener('DOMContentLoaded', () => {
    // Update current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // DOM Elements
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const certCards = document.querySelectorAll('.cert-card');
    const contactForm = document.querySelector('.contact-form');
    
    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // Close mobile menu when a link is clicked
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Check if timeline items are in view
        animateOnScroll();
    });
    
    // Apply staggered animation delay to certification cards
    certCards.forEach((card, index) => {
        card.style.setProperty('--i', index);
    });
    
    // Handle contact form submission (for demonstration purposes)
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // For demonstration - normally you would send to a server
            console.log('Form submitted:', { name, email, subject, message });
            
            // Show success message (for demonstration)
            const formGroups = document.querySelectorAll('.form-group');
            formGroups.forEach(group => group.style.display = 'none');
            
            const submitBtn = document.querySelector('.contact-form button');
            submitBtn.style.display = 'none';
            
            const successMsg = document.createElement('p');
            successMsg.textContent = 'Thank you for your message! I will get back to you soon.';
            successMsg.classList.add('success-message');
            successMsg.style.color = '#FF9000';
            successMsg.style.fontSize = '18px';
            successMsg.style.textAlign = 'center';
            successMsg.style.padding = '40px 0';
            
            contactForm.appendChild(successMsg);
            
            // Reset form
            contactForm.reset();
            
            // Optional: Restore form after 5 seconds
            setTimeout(() => {
                formGroups.forEach(group => group.style.display = 'block');
                submitBtn.style.display = 'block';
                successMsg.remove();
            }, 5000);
        });
    }
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Animate elements when they come into view
    function animateOnScroll() {
        // Animate timeline items
        timelineItems.forEach(item => {
            if (isInViewport(item)) {
                item.classList.add('visible');
            }
        });
        
        // Animate certification cards
        certCards.forEach(card => {
            if (isInViewport(card)) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Run animation check on page load
    animateOnScroll();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Offset for header height
                const headerHeight = header.offsetHeight;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Typing effect for tagline (optional)
    const tagline = document.querySelector('.tagline .highlight');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                tagline.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 1000);
    }
});
