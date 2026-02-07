// about.js - About page specific functionality

document.addEventListener('DOMContentLoaded', function() {
    // Animate timeline items on scroll
    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = 'all 0.6s ease';
        timelineObserver.observe(item);
    });

    // Animate value cards
    const valueObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                valueObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.5s ease';
        valueObserver.observe(card);
    });

    // Animate VM cards
    const vmCards = document.querySelectorAll('.vm-card');
    vmCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        card.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, 200 + (index * 200));
    });

    // Add pulse animation to timeline dots on hover
    const timelineDots = document.querySelectorAll('.timeline-dot');
    timelineDots.forEach(dot => {
        dot.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.5s ease';
        });
        
        dot.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });

    // Save about page visit
    const aboutVisits = storage.get('jpcs_about_visits') || 0;
    storage.set('jpcs_about_visits', aboutVisits + 1);
});

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.5);
        }
    }
`;
document.head.appendChild(style);