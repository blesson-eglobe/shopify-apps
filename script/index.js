/** index.js **/

document.addEventListener('DOMContentLoaded', () => {
    // --- Sticky Navbar ---
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
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
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
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

    // --- Documentation Template Logic ---
    // This section handles sidebar interactivity and responsiveness for the documentation template.
    
    const docsSidebar = document.querySelector('.docs-sidebar');
    const docsHamburger = document.querySelector('.docs-hamburger');
    const docsNavLinks = document.querySelectorAll('.docs-nav-links a');
    const docsSections = document.querySelectorAll('.docs-section');

    // Toggle Mobile Sidebar for Documentation
    if (docsHamburger && docsSidebar) {
        docsHamburger.addEventListener('click', () => {
            docsSidebar.classList.toggle('open');
            const icon = docsHamburger.querySelector('i');
            if (docsSidebar.classList.contains('open')) {
                icon.className = 'bx bx-x';
            } else {
                icon.className = 'bx bx-menu';
            }
        });
    }

    // Scroll Active Link Highlighting for Documentation
    if (docsSections.length > 0) {
        const docsObserverOptions = {
            root: null,
            rootMargin: '-10% 0px -60% 0px',
            threshold: 0
        };


        const docsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    updateDocsActiveLink(id);
                }
            });
        }, docsObserverOptions);

        docsSections.forEach(section => docsObserver.observe(section));

        function updateDocsActiveLink(id) {
            // Only update if we have a valid section ID
            if (!id || id === ' ' || id === '#') return;

            docsNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }

    }

    // Handle sidebar link clicks
    docsNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            
            // Only handle internal section links
            if (href && href.startsWith('#') && href !== '#') {
                const id = href.replace('#', '');
                if (typeof updateDocsActiveLink === 'function') {
                    updateDocsActiveLink(id);
                }
            }

            // Mobile drawer handling

            if (window.innerWidth <= 1024 && docsSidebar) {
                docsSidebar.classList.remove('open');
                if (docsHamburger) {
                    const icon = docsHamburger.querySelector('i');
                    icon.className = 'bx bx-menu';
                }
            }
        });
    });


    // --- Accordion Toggle Logic ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Optional: Close other items (exclusive accordion)
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

});

