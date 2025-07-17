// Additional component functionality and interactions

// Enhanced form validation
class FormValidator {
    constructor(form) {
        this.form = form;
        this.errors = {};
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            if (!this.validate()) {
                e.preventDefault();
                this.showErrors();
            }
        });
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    validate() {
        this.errors = {};
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => this.validateField(input));
        
        return Object.keys(this.errors).length === 0;
    }
    
    validateField(input) {
        const value = input.value.trim();
        const name = input.name;
        
        // Required field validation
        if (input.hasAttribute('required') && !value) {
            this.errors[name] = 'Este campo es obligatorio';
            return false;
        }
        
        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.errors[name] = 'Por favor ingresa un email válido';
                return false;
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                this.errors[name] = 'Por favor ingresa un teléfono válido';
                return false;
            }
        }
        
        // Radio button validation
        if (input.type === 'radio' && input.hasAttribute('required')) {
            const radioGroup = this.form.querySelectorAll(`input[name="${name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) {
                this.errors[name] = 'Por favor selecciona una opción';
                return false;
            }
        }
        
        // Clear error if validation passes
        delete this.errors[name];
        this.clearFieldError(input);
        return true;
    }
    
    showErrors() {
        Object.keys(this.errors).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                this.showFieldError(field, this.errors[fieldName]);
            }
        });
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
}

// Initialize form validators
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => new FormValidator(form));
});

// Enhanced gallery with touch support
class TouchGallery {
    constructor(galleryElement) {
        this.gallery = galleryElement;
        this.modal = document.getElementById('gallery-modal');
        this.currentIndex = 0;
        this.images = [];
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        this.setupImages();
        this.setupTouchEvents();
        this.setupKeyboardEvents();
    }
    
    setupImages() {
        const items = this.gallery.querySelectorAll('.gallery-item');
        this.images = Array.from(items).map(item => ({
            src: item.dataset.src,
            alt: item.querySelector('img').alt,
            title: item.querySelector('h3').textContent
        }));
    }
    
    setupTouchEvents() {
        if (this.modal) {
            this.modal.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            });
            
            this.modal.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            });
        }
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                this.nextImage();
            } else {
                // Swipe right - previous image
                this.prevImage();
            }
        }
    }
    
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (this.modal.classList.contains('active')) {
                switch(e.key) {
                    case 'ArrowLeft':
                        this.prevImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                    case 'Escape':
                        this.closeModal();
                        break;
                }
            }
        });
    }
    
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
    }
    
    prevImage() {
        this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
        this.updateImage();
    }
    
    updateImage() {
        const modalImage = document.getElementById('modal-image');
        const modalCaption = document.getElementById('modal-caption');
        const image = this.images[this.currentIndex];
        
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalCaption.textContent = image.title;
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Animated counters
class AnimatedCounter {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = target;
        this.duration = duration;
        this.current = 0;
        this.increment = target / (duration / 16);
        this.hasAnimated = false;
    }
    
    animate() {
        if (this.hasAnimated) return;
        
        const updateCounter = () => {
            if (this.current < this.target) {
                this.current += this.increment;
                this.element.textContent = Math.floor(this.current);
                requestAnimationFrame(updateCounter);
            } else {
                this.element.textContent = this.target;
                this.hasAnimated = true;
            }
        };
        
        updateCounter();
    }
}

// Parallax scrolling effect
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }
    
    init() {
        if (this.elements.length === 0) return;
        
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => this.updateParallax());
        });
    }
    
    updateParallax() {
        const scrollTop = window.pageYOffset;
        
        this.elements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// Loading animation
class LoadingManager {
    constructor() {
        this.loader = this.createLoader();
        this.init();
    }
    
    createLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-heart">
                    <i class="fas fa-heart"></i>
                </div>
                <div class="loader-text">Cargando...</div>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .page-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #fdf2f8, #ffffff, #fef3c7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                transition: opacity 0.5s ease-out;
            }
            
            .loader-content {
                text-align: center;
            }
            
            .loader-heart {
                font-size: 3rem;
                color: #e11d48;
                margin-bottom: 1rem;
                animation: heartbeat 1.5s ease-in-out infinite;
            }
            
            .loader-text {
                font-size: 1.25rem;
                color: #374151;
                font-weight: 500;
            }
            
            @keyframes heartbeat {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
        `;
        
        document.head.appendChild(style);
        return loader;
    }
    
    init() {
        document.body.appendChild(this.loader);
        
        window.addEventListener('load', () => {
            setTimeout(() => this.hide(), 500);
        });
    }
    
    hide() {
        this.loader.style.opacity = '0';
        setTimeout(() => {
            if (this.loader.parentNode) {
                this.loader.parentNode.removeChild(this.loader);
            }
        }, 500);
    }
}

// Notification system
class NotificationManager {
    constructor() {
        this.container = this.createContainer();
        this.notifications = [];
    }
    
    createContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
        return container;
    }
    
    show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            margin-bottom: 0.5rem;
            pointer-events: auto;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            border-left: 4px solid ${this.getTypeColor(type)};
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas ${this.getTypeIcon(type)}" style="color: ${this.getTypeColor(type)};"></i>
                <span style="color: #374151; font-weight: 500;">${message}</span>
            </div>
        `;
        
        this.container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            this.remove(notification);
        }, duration);
        
        // Click to remove
        notification.addEventListener('click', () => {
            this.remove(notification);
        });
        
        this.notifications.push(notification);
    }
    
    remove(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 300);
    }
    
    getTypeColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }
    
    getTypeIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Initialize components
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading manager
    new LoadingManager();
    
    // Initialize notification manager
    window.notifications = new NotificationManager();
    
    // Initialize enhanced gallery
    const gallery = document.getElementById('gallery-grid');
    if (gallery) {
        new TouchGallery(gallery);
    }
    
    // Initialize parallax effects
    new ParallaxEffect();
    
    // Initialize animated counters for countdown
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.countdown-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.textContent);
                    if (target > 0) {
                        const animatedCounter = new AnimatedCounter(counter, target);
                        animatedCounter.animate();
                    }
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const countdownSection = document.querySelector('.countdown');
    if (countdownSection) {
        counterObserver.observe(countdownSection);
    }
});

// Service Worker registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Add CSS for form validation errors
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .field-error {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .field-error::before {
        content: '⚠';
        font-size: 0.75rem;
    }
`;
document.head.appendChild(validationStyles);