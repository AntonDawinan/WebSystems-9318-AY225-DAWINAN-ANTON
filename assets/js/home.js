// home.js - Home page specific functionality

document.addEventListener('DOMContentLoaded', function() {
    // Animated counter for statistics
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;
        
        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Intersection Observer for stats animation
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(statNumber => {
                    const target = parseInt(statNumber.getAttribute('data-target'));
                    animateCounter(statNumber, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.quick-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Feature cards hover effect
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = 'var(--primary)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderColor = 'transparent';
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        }
    });

    // Add entrance animation to feature cards
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.5s ease';
        cardObserver.observe(card);
    });

    // Save homepage visit
    const homeVisits = storage.get('jpcs_home_visits') || 0;
    storage.set('jpcs_home_visits', homeVisits + 1);
    
    // Show welcome message for first-time visitors
    if (homeVisits === 0) {
        console.log('Welcome to JPCS! 🎉');
    }
});