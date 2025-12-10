document.addEventListener('DOMContentLoaded', () => {
    // ===================================
    // 1. Skill Bar Animation (Intersection Observer)
    // ===================================
    const skillLevels = document.querySelectorAll('.skill-level');
    const skillsSection = document.getElementById('skills');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 
    };

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate the bars by setting the width based on the data attribute
                skillLevels.forEach(bar => {
                    const level = bar.getAttribute('data-level');
                    bar.style.width = level;
                });
                observer.unobserve(skillsSection);
            }
        });
    }, observerOptions);

    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }
    
    // ===================================
    // 2. Project Filtering
    // ===================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block'; 
                } else {
                    card.style.display = 'none'; 
                }
            });
        });
    });

    // ===================================
    // 3. Navigation Scrollspy & Click Handling
    // ===================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const headerHeight = document.querySelector('header').offsetHeight; // Get fixed header height

    // Helper function to set the active link
    function setActiveLink(currentId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.href.includes(currentId)) {
                link.classList.add('active');
            }
        });
    }

    // A. Handle Click Events (Immediate feedback for underline)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Ensure the active state is set immediately on click
            const targetId = this.getAttribute('href').substring(1);
            setActiveLink(targetId);
        });
    });
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Prevent default jump so we can account for fixed header offset
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetEl = document.getElementById(targetId);

                if (targetEl) {
                    const topPos = targetEl.offsetTop - headerHeight + 1; // slight offset
                    window.scrollTo({ top: topPos, behavior: 'smooth' });
                }

                // Close mobile menu if open
                const menuToggle = document.querySelector('.menu-toggle');
                const navLinksEl = document.querySelector('.nav-links');
                if (menuToggle && navLinksEl.classList.contains('mobile-open')) {
                    navLinksEl.classList.remove('mobile-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }

                // Set active state on the clicked link immediately
                setActiveLink(targetId);
                // Update the URL hash without jumping
                history.replaceState(null, '', '#' + targetId);
            });
        });

    // B. Handle Scroll Events (Updates as user scrolls)
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            // Adjust section top position by header height for accurate detection
            const sectionTop = section.offsetTop - headerHeight; 
            
            // We check if the scroll position is past the section top
            if (scrollY >= sectionTop - 1) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            setActiveLink(current);
        }
    });

    // Mobile menu toggle behavior (outside DOMContentLoaded to ensure button exists)
    document.addEventListener('DOMContentLoaded', () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinksEl = document.querySelector('.nav-links');
        if (menuToggle && navLinksEl) {
            menuToggle.addEventListener('click', () => {
                const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', String(!expanded));
                navLinksEl.classList.toggle('mobile-open');
            });
        }
    });
    
    // Theme toggle: persist theme in localStorage and apply
    const themeToggleBtn = document.getElementById('theme-toggle');
    const rootEl = document.documentElement;

    function applyTheme(theme) {
        if (theme === 'dark') {
            rootEl.setAttribute('data-theme', 'dark');
            if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            rootEl.removeAttribute('data-theme');
            if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
    }

    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const current = rootEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem('theme', next);
        });
    }
    
    // Contact Form Submission Handling (FormSubmit API)
    // FormSubmit will automatically send the email to pranaykumarsriram@gmail.com
    // No additional JavaScript needed - the form action handles everything

});