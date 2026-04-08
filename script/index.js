/** index.js **/

document.addEventListener('DOMContentLoaded', () => {
    // --- Sticky Navbar ---
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(11, 15, 25, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(11, 15, 25, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // --- Mobile Hamburger Toggle ---
    const hamburger = document.getElementById('hamburger');
    const mobileDrawer = document.getElementById('mobile-drawer');

    if (hamburger && mobileDrawer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileDrawer.classList.toggle('open');
            document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
        });

        // Close drawer when a link is clicked
        mobileDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileDrawer.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    // Select elements to animate
    const animatedElements = document.querySelectorAll('.app-card, .feature-card, .testimonial-card, .section-title, .section-subtitle, .section-badge');
    
    // Add initial styles for styling (opacity 0, translate Y)
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    // Create the observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine delay based on element type or index if it's a card in a grid
                let delay = 0;
                
                if (entry.target.classList.contains('app-card') || 
                    entry.target.classList.contains('feature-card') || 
                    entry.target.classList.contains('testimonial-card')) {
                    
                    // Simple staggered delay based on elements in view
                    const siblings = Array.from(entry.target.parentElement.children);
                    const index = siblings.indexOf(entry.target);
                    // Add a small delay based on index for staggered effect, modulo 3 or 4 mostly
                    delay = (index % 4) * 0.1;
                }
                
                entry.target.style.transitionDelay = `${delay}s`;
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Unobserve after animating once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Start observing
    animatedElements.forEach(el => observer.observe(el));

    // --- Counter Animation ---
    const counterElements = document.querySelectorAll('.counter');
    
    const animateCounter = (el) => {
        const target = parseFloat(el.getAttribute('data-target') || 0);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const separator = el.getAttribute('data-separator') || '';
        const duration = 2000; // 2 seconds
        
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = easeProgress * target;
            
            // Format number
            let formattedValue;
            const isFloat = !Number.isInteger(target) || (target.toString().indexOf('.') !== -1);
            
            if (!isFloat) {
                formattedValue = Math.floor(currentVal).toString();
                if (separator) {
                    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
                }
            } else {
                const decimals = target.toString().split('.')[1]?.length || 1;
                formattedValue = currentVal.toFixed(decimals);
            }
            
            el.innerHTML = prefix + formattedValue + suffix;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Ensure exact target at the end
                let finalFormatted = target.toString();
                if (separator && !isFloat) {
                    finalFormatted = finalFormatted.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
                }
                el.innerHTML = prefix + finalFormatted + suffix;
            }
        };
        
        window.requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Small delay to allow element transitions (like slideUp) to start
                setTimeout(() => {
                    animateCounter(entry.target);
                }, 300);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    counterElements.forEach(el => counterObserver.observe(el));
});
