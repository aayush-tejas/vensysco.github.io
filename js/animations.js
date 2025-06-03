// Animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animation on Scroll)
    // This is a simplified version of AOS functionality
    const animateElements = document.querySelectorAll('[data-aos]');
    
    function checkAnimation() {
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                const animationType = element.getAttribute('data-aos');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                
                if (animationType === 'fade-up') {
                    element.style.transform = 'translateY(0)';
                } else if (animationType === 'fade-left') {
                    element.style.transform = 'translateX(0)';
                } else if (animationType === 'fade-right') {
                    element.style.transform = 'translateX(0)';
                } else if (animationType === 'zoom-in') {
                    element.style.transform = 'scale(1)';
                }
            }
        });
    }
    
    // Set initial state for animated elements
    animateElements.forEach(element => {
        const animationType = element.getAttribute('data-aos');
        element.style.opacity = '0';
        element.style.transition = 'all 0.6s ease-out';
        
        if (animationType === 'fade-up') {
            element.style.transform = 'translateY(30px)';
        } else if (animationType === 'fade-left') {
            element.style.transform = 'translateX(-30px)';
        } else if (animationType === 'fade-right') {
            element.style.transform = 'translateX(30px)';
        } else if (animationType === 'zoom-in') {
            element.style.transform = 'scale(0.9)';
        }
    });
    
    // Check animation on load and scroll
    window.addEventListener('load', checkAnimation);
    window.addEventListener('scroll', checkAnimation);
    
    // Floating elements animation
    const floatingElements = document.querySelectorAll('.floating-server, .floating-database, .floating-shield');
    
    floatingElements.forEach((element, index) => {
        // Randomize initial position and animation delay
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        const randomDelay = Math.random() * 2;
        
        element.style.transform = `translate(${randomX}px, ${randomY}px)`;
        element.style.animationDelay = `${randomDelay}s`;
    });
    
    // Feature cards hover effect
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon');
            icon.style.transform = 'rotateY(180deg)';
            setTimeout(() => {
                icon.style.transform = 'rotateY(360deg)';
            }, 300);
        });
    });
    
    // Pricing card hover effect
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('popular')) return;
            
            const badge = this.querySelector('.popular-badge');
            badge.style.transform = 'rotate(5deg) scale(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('popular')) return;
            
            const badge = this.querySelector('.popular-badge');
            badge.style.transform = 'rotate(0) scale(1)';
        });
    });
});