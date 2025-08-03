// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll to Section Function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form Submission Handler
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const organization = this.querySelector('input[placeholder="Organization"]').value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !organization) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Demo request submitted successfully! We\'ll contact you soon.', 'success');
        
        // Reset form
        this.reset();
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.solution-card, .impact-card, .problem-card, .step');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Interactive Map Simulation
function initializeMapSimulation() {
    const mapContainer = document.querySelector('.interactive-map');
    if (!mapContainer) return;
    
    // Add click event to map
    mapContainer.addEventListener('click', (e) => {
        const rect = mapContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create a temporary dot at click location
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 8px;
            height: 8px;
            background: #ef4444;
            border-radius: 50%;
            animation: pulse 1s ease-out;
        `;
        
        mapContainer.appendChild(dot);
        
        // Remove dot after animation
        setTimeout(() => {
            dot.remove();
        }, 1000);
    });
}

// Counter Animation for Impact Numbers
function animateCounters() {
    const counters = document.querySelectorAll('.impact-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isNumeric = /[\d.]/.test(target);
        
        if (isNumeric) {
            const finalValue = parseFloat(target.replace(/[^\d.]/g, ''));
            const suffix = target.replace(/[\d.]/g, '');
            let currentValue = 0;
            const increment = finalValue / 50;
            
            const updateCounter = () => {
                if (currentValue < finalValue) {
                    currentValue += increment;
                    counter.textContent = Math.floor(currentValue) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        }
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeMapSimulation();
    
    // Trigger counter animation when impact section is visible
    const impactSection = document.getElementById('impact');
    if (impactSection) {
        const impactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    impactObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        impactObserver.observe(impactSection);
    }
    
    // Add hover effects to solution cards
    const solutionCards = document.querySelectorAll('.solution-card');
    solutionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to impact cards
    const impactCards = document.querySelectorAll('.impact-card');
    impactCards.forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'translateY(-5px)';
            }, 150);
        });
    });
});

// Demo Video Placeholder Click Handler
document.addEventListener('DOMContentLoaded', () => {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', () => {
            showNotification('Demo video would play here. This is a placeholder for the actual demo video.', 'info');
        });
    }
});

// Property Verification Simulation
function simulatePropertyVerification() {
    const searchInput = document.querySelector('input[placeholder*="location"]');
    const searchButton = document.querySelector('button[onclick*="verification"]');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', () => {
            const location = searchInput.value.trim();
            if (location) {
                // Simulate API call delay
                setTimeout(() => {
                    const isVerified = Math.random() > 0.5;
                    const message = isVerified 
                        ? `Property at ${location} is verified and on record.`
                        : `Property at ${location} is NOT on record. Proceed with caution.`;
                    
                    showNotification(message, isVerified ? 'success' : 'error');
                }, 1000);
            }
        });
    }
}

// Initialize verification simulation
document.addEventListener('DOMContentLoaded', simulatePropertyVerification); 