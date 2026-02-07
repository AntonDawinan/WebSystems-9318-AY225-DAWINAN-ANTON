// events.js - Events page with filtering and modals

// Sample events data
const eventsData = [
    {
        id: 1,
        title: 'Web Development Bootcamp',
        category: 'workshop',
        date: '2024-03-15',
        time: '9:00 AM - 5:00 PM',
        location: 'Computer Laboratory 1',
        icon: '💻',
        description: 'Learn the fundamentals of modern web development including HTML, CSS, JavaScript, and React.',
        participants: 50,
        status: 'upcoming',
        details: [
            'Hands-on coding exercises',
            'Build a complete web application',
            'Certificate of completion',
            'Free lunch and snacks'
        ],
        speaker: 'Prof. Maria Santos'
    },
    {
        id: 2,
        title: 'AI & Machine Learning Seminar',
        category: 'seminar',
        date: '2024-03-20',
        time: '2:00 PM - 5:00 PM',
        location: 'Auditorium',
        icon: '🤖',
        description: 'Explore the exciting world of AI and machine learning with industry experts.',
        participants: 120,
        status: 'upcoming',
        details: [
            'Introduction to AI concepts',
            'Real-world ML applications',
            'Q&A with industry professionals',
            'Networking opportunity'
        ],
        speaker: 'Dr. Juan Reyes, AI Researcher'
    },
    {
        id: 3,
        title: 'Hackathon 2024',
        category: 'competition',
        date: '2024-04-05',
        time: '8:00 AM - 8:00 PM',
        location: 'Innovation Hub',
        icon: '🏆',
        description: '24-hour coding competition to build innovative solutions to real-world problems.',
        participants: 80,
        status: 'upcoming',
        details: [
            'Team competition (3-4 members)',
            'Cash prizes for top 3 teams',
            'Mentorship from industry experts',
            'Free meals and refreshments',
            'Networking with sponsors'
        ],
        speaker: 'Multiple Mentors'
    },
    {
        id: 4,
        title: 'Tech Talk: Cybersecurity',
        category: 'seminar',
        date: '2024-02-28',
        time: '3:00 PM - 5:00 PM',
        location: 'Room 301',
        icon: '🔒',
        description: 'Learn about cybersecurity best practices and latest threats in the digital world.',
        participants: 75,
        status: 'past',
        details: [
            'Common security vulnerabilities',
            'Ethical hacking basics',
            'Security tools and techniques',
            'Career paths in cybersecurity'
        ],
        speaker: 'Sec. Carlos Martinez'
    },
    {
        id: 5,
        title: 'Mobile App Development Workshop',
        category: 'workshop',
        date: '2024-02-15',
        time: '1:00 PM - 6:00 PM',
        location: 'Computer Laboratory 2',
        icon: '📱',
        description: 'Build your first mobile application using React Native.',
        participants: 45,
        status: 'past',
        details: [
            'React Native fundamentals',
            'Build a complete mobile app',
            'Deploy to app stores',
            'Best practices in mobile development'
        ],
        speaker: 'Dev. Sofia Fernandez'
    },
    {
        id: 6,
        title: 'JPCS Game Night',
        category: 'social',
        date: '2024-03-25',
        time: '6:00 PM - 10:00 PM',
        location: 'Student Lounge',
        icon: '🎮',
        description: 'Unwind and connect with fellow members through fun gaming activities.',
        participants: 60,
        status: 'upcoming',
        details: [
            'Video game tournaments',
            'Board games',
            'Free pizza and drinks',
            'Prizes for winners'
        ],
        speaker: 'Events Committee'
    },
    {
        id: 7,
        title: 'Git & GitHub Workshop',
        category: 'workshop',
        date: '2024-04-12',
        time: '2:00 PM - 5:00 PM',
        location: 'Computer Laboratory 1',
        icon: '🔀',
        description: 'Master version control with Git and collaborate effectively using GitHub.',
        participants: 55,
        status: 'upcoming',
        details: [
            'Git basics and commands',
            'Branching and merging',
            'Collaboration workflows',
            'Open source contribution'
        ],
        speaker: 'Eng. Diego Ramos'
    },
    {
        id: 8,
        title: 'Code Challenge Competition',
        category: 'competition',
        date: '2024-02-10',
        time: '10:00 AM - 4:00 PM',
        location: 'Computer Laboratory 3',
        icon: '⚡',
        description: 'Test your coding skills in this algorithmic problem-solving competition.',
        participants: 90,
        status: 'past',
        details: [
            'Individual competition',
            'Algorithmic challenges',
            'Medals for top performers',
            'Coding interview preparation'
        ],
        speaker: 'Technical Committee'
    }
];

// Map event IDs to local image filenames (use the files you added in assets/Images)
const eventImageFiles = {
    1: 'web-development-bootcamp.jpg',
    2: 'ai-machine-learning-seminar.jpg',
    3: 'hackathon-2024.jpg',
    4: 'tech-talk-cybersecurity.jpg',
    5: 'mobile-app-workshop.jpg',
    6: 'jpcs-game-night.jpg',
    7: 'git-github-workshop.png',
    8: 'code-challenge-competition.jpg'
};

// Return a local image path for the event if available; otherwise fallback to seeded picsum
function getEventImageUrl(id, width = 800, height = 400) {
    const filename = eventImageFiles[id];
    if (filename) return `assets/Images/${filename}`;
    return `https://picsum.photos/seed/jpcs_event_${id}/${width}/${height}`;
}

document.addEventListener('DOMContentLoaded', function() {
    // Render all events initially
    renderEvents(eventsData);
    
    // Setup filters
    setupCategoryFilters();
    setupTimeFilters();
    setupSearch();
    
    // Setup modal
    setupEventModal();
    
    // Save events page visit
    const eventsVisits = storage.get('jpcs_events_visits') || 0;
    storage.set('jpcs_events_visits', eventsVisits + 1);
});

function renderEvents(events) {
    const container = document.getElementById('eventsGrid');
    const noEvents = document.getElementById('noEvents');
    
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = '';
        noEvents.style.display = 'block';
        return;
    }
    
    noEvents.style.display = 'none';
    
    container.innerHTML = events.map(event => {
        const imgUrl = getEventImageUrl(event.id, 800, 400);
        return `
        <div class="event-card" data-category="${event.category}" data-time="${event.status}" data-id="${event.id}">
            <div class="event-banner">
                <img src="${imgUrl}" alt="${event.title}">
                <span class="event-status ${event.status}">${capitalizeFirst(event.status)}</span>
            </div>
            <div class="event-content">
                <span class="event-category">${capitalizeFirst(event.category)}</span>
                <h3 class="event-title">${event.title}</h3>
                <div class="event-date">📅 ${formatDate(event.date)}</div>
                <div class="event-date">🕒 ${event.time}</div>
                <div class="event-location">📍 ${event.location}</div>
                <p class="event-description">${event.description}</p>
                <div class="event-footer">
                    <span class="event-participants">👥 ${event.participants} registered</span>
                    <button class="learn-more-btn" onclick="showEventDetails(${event.id})">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');
}

function setupCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn[data-category]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filters
            applyFilters();
        });
    });
}

function setupTimeFilters() {
    const timeButtons = document.querySelectorAll('.time-filter-btn');
    
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            timeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filters
            applyFilters();
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyFilters();
        });
    }
}

function applyFilters() {
    const categoryFilter = document.querySelector('.filter-btn[data-category].active').getAttribute('data-category');
    const timeFilter = document.querySelector('.time-filter-btn.active').getAttribute('data-time');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filteredEvents = eventsData.filter(event => {
        const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
        const matchesTime = timeFilter === 'all' || event.status === timeFilter;
        const matchesSearch = searchTerm === '' || 
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm);
        
        return matchesCategory && matchesTime && matchesSearch;
    });
    
    renderEvents(filteredEvents);
}

function setupEventModal() {
    const modal = document.getElementById('eventModal');
    const closeBtn = document.getElementById('closeEventModal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('show');
        });
    }
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });
}

function showEventDetails(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    
    if (!event) return;
    
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('eventModalBody');
    
    const modalImg = getEventImageUrl(event.id, 300, 300);
    modalBody.innerHTML = `
        <div class="event-modal-content">
            <div class="event-modal-banner"><img src="${modalImg}" alt="${event.title}"></div>
            <h2>${event.title}</h2>
            <div class="event-modal-meta">
                <span class="meta-item">📅 ${formatDate(event.date)}</span>
                <span class="meta-item">🕒 ${event.time}</span>
                <span class="meta-item">📍 ${event.location}</span>
            </div>
            <div class="event-modal-description">
                <p>${event.description}</p>
                <p><strong>Speaker:</strong> ${event.speaker}</p>
            </div>
            <div class="event-details-section">
                <h4>What to Expect:</h4>
                <ul>
                    ${event.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
            ${event.status === 'upcoming' ? `
                <a href="membership.html" class="register-btn">Register Now</a>
            ` : ''}
        </div>
    `;
    
    modal.classList.add('show');
    
    // Save event view
    saveEventView(eventId);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function saveEventView(eventId) {
    const views = storage.get('jpcs_event_views') || {};
    views[eventId] = (views[eventId] || 0) + 1;
    storage.set('jpcs_event_views', views);
}

// Make function available globally
window.showEventDetails = showEventDetails;