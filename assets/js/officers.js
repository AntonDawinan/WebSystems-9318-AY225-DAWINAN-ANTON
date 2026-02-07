// officers.js - Officers page with interactive profiles

// Sample officers data
const executiveOfficers = [
    {
        id: 1,
        name: 'Maria Santos',
        position: 'President',
        department: 'BS Computer Science',
        avatar: '👩‍💼',
        email: 'maria.santos@jpcs.org',
        bio: 'Leading JPCS with passion for tech innovation and community building.',
        skills: ['Leadership', 'Project Management', 'Public Speaking', 'Web Development'],
        yearLevel: '4th Year'
    },
    {
        id: 2,
        name: 'Juan dela Cruz',
        position: 'Vice President',
        department: 'BS Information Technology',
        avatar: '👨‍💼',
        email: 'juan.delacruz@jpcs.org',
        bio: 'Supporting organizational growth and member engagement initiatives.',
        skills: ['Team Management', 'Event Planning', 'Mobile Development'],
        yearLevel: '3rd Year'
    },
    {
        id: 3,
        name: 'Isabella Garcia',
        position: 'Secretary',
        department: 'BS Computer Science',
        avatar: '👩‍💻',
        email: 'isabella.garcia@jpcs.org',
        bio: 'Managing documentation and ensuring smooth operations.',
        skills: ['Documentation', 'Organization', 'Communication', 'Python'],
        yearLevel: '3rd Year'
    },
    {
        id: 4,
        name: 'Carlos Reyes',
        position: 'Treasurer',
        department: 'BS Information Systems',
        avatar: '👨‍💻',
        email: 'carlos.reyes@jpcs.org',
        bio: 'Handling finances and budget planning for all JPCS activities.',
        skills: ['Financial Management', 'Budget Planning', 'Excel', 'Data Analysis'],
        yearLevel: '4th Year'
    }
];

const committeeMembers = [
    {
        id: 5,
        name: 'Sofia Mendoza',
        position: 'Technical Head',
        committee: 'technical',
        avatar: '👩‍🔬',
        email: 'sofia.mendoza@jpcs.org',
        bio: 'Leading technical workshops and coding sessions.',
        skills: ['Full Stack Development', 'AI/ML', 'Cloud Computing'],
        yearLevel: '3rd Year'
    },
    {
        id: 6,
        name: 'Miguel Torres',
        position: 'Events Coordinator',
        committee: 'events',
        avatar: '👨‍🎨',
        email: 'miguel.torres@jpcs.org',
        bio: 'Organizing amazing events and activities for members.',
        skills: ['Event Management', 'Logistics', 'Vendor Relations'],
        yearLevel: '2nd Year'
    },
    {
        id: 7,
        name: 'Ana Cruz',
        position: 'Marketing Head',
        committee: 'marketing',
        avatar: '👩‍🎨',
        email: 'ana.cruz@jpcs.org',
        bio: 'Creating engaging content and managing social media presence.',
        skills: ['Digital Marketing', 'Graphic Design', 'Content Creation'],
        yearLevel: '3rd Year'
    },
    {
        id: 8,
        name: 'Diego Ramos',
        position: 'Finance Officer',
        committee: 'finance',
        avatar: '👨‍💼',
        email: 'diego.ramos@jpcs.org',
        bio: 'Assisting with budget tracking and financial reports.',
        skills: ['Accounting', 'Financial Analysis', 'Excel'],
        yearLevel: '2nd Year'
    },
    {
        id: 9,
        name: 'Lucia Fernandez',
        position: 'Workshop Coordinator',
        committee: 'technical',
        avatar: '👩‍🏫',
        email: 'lucia.fernandez@jpcs.org',
        bio: 'Coordinating technical workshops and training sessions.',
        skills: ['Training', 'Python', 'Web Development', 'Teaching'],
        yearLevel: '4th Year'
    },
    {
        id: 10,
        name: 'Roberto Silva',
        position: 'Social Media Manager',
        committee: 'marketing',
        avatar: '👨‍💻',
        email: 'roberto.silva@jpcs.org',
        bio: 'Managing JPCS online presence and engagement.',
        skills: ['Social Media', 'Content Strategy', 'Analytics'],
        yearLevel: '2nd Year'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Render executive officers
    renderOfficers(executiveOfficers, 'executiveOfficers');
    
    // Render committee members
    renderMembers(committeeMembers, 'committeeMembers');
    
    // Setup filter functionality
    setupFilters();
    
    // Setup modal
    setupModal();
});

// Return a deterministic avatar URL for a given id so images stay the same
function getAvatarUrl(id, size = 300) {
    return `https://i.pravatar.cc/${size}?u=jpcs_${id}`;
}

function renderOfficers(officers, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = officers.map(officer => {
        const avatarUrl = getAvatarUrl(officer.id, 400);
        return `
        <div class="officer-card" data-id="${officer.id}">
            <div class="officer-avatar"><img src="${avatarUrl}" alt="${officer.name}"></div>
            <div class="officer-info">
                <h3 class="officer-name">${officer.name}</h3>
                <p class="officer-position">${officer.position}</p>
                <p class="officer-department">${officer.department}</p>
                <button class="view-profile-btn" onclick="showProfile(${officer.id}, 'officer')">
                    View Profile
                </button>
            </div>
        </div>
    `;
    }).join('');
}

function renderMembers(members, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = members.map(member => {
        const avatarUrl = getAvatarUrl(member.id, 400);
        return `
        <div class="member-card" data-id="${member.id}" data-committee="${member.committee}">
            <div class="member-avatar"><img src="${avatarUrl}" alt="${member.name}"></div>
            <div class="member-info">
                <h3 class="member-name">${member.name}</h3>
                <p class="member-position">${member.position}</p>
                <p class="member-committee">${capitalizeFirst(member.committee)} Committee</p>
                <button class="view-profile-btn" onclick="showProfile(${member.id}, 'member')">
                    View Profile
                </button>
            </div>
        </div>
    `;
    }).join('');
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const committee = this.getAttribute('data-committee');
            
            // Filter members
            filterMembers(committee);
        });
    });
}

function filterMembers(committee) {
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        if (committee === 'all' || card.getAttribute('data-committee') === committee) {
            card.classList.remove('hidden');
            card.style.display = 'block';
        } else {
            card.classList.add('hidden');
            card.style.display = 'none';
        }
    });
}

function setupModal() {
    const modal = document.getElementById('profileModal');
    const closeBtn = document.getElementById('closeModal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('show');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });
}

function showProfile(id, type) {
    const person = type === 'officer' 
        ? executiveOfficers.find(o => o.id === id)
        : committeeMembers.find(m => m.id === id);
    
    if (!person) return;
    
    const modal = document.getElementById('profileModal');
    const modalBody = document.getElementById('modalBody');
    
    const roleLabel = type === 'officer' ? 'Department' : 'Committee';
    const roleValue = type === 'officer' 
        ? person.department 
        : capitalizeFirst(person.committee) + ' Committee';
    
    const avatarUrl = getAvatarUrl(person.id, 300);
    modalBody.innerHTML = `
        <div class="modal-profile">
            <div class="modal-avatar"><img src="${avatarUrl}" alt="${person.name}"></div>
            <h2>${person.name}</h2>
            <p class="position">${person.position}</p>
            <p class="${type === 'officer' ? 'department' : 'committee'}">${roleValue}</p>
            
            <div class="profile-details">
                <div class="detail-item">
                    <strong>Year Level</strong>
                    <p>${person.yearLevel}</p>
                </div>
                
                <div class="detail-item">
                    <strong>About</strong>
                    <p>${person.bio}</p>
                </div>
                
                <div class="detail-item">
                    <strong>Skills</strong>
                    <div class="profile-skills">
                        ${person.skills.map(skill => `
                            <span class="skill-tag">${skill}</span>
                        `).join('')}
                    </div>
                </div>
                
                <div class="contact-info">
                    <a href="mailto:${person.email}" class="contact-link">
                        📧 Email
                    </a>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    
    // Save profile view to localStorage
    saveProfileView(id, type);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function saveProfileView(id, type) {
    const views = storage.get('jpcs_profile_views') || {};
    const key = `${type}_${id}`;
    views[key] = (views[key] || 0) + 1;
    storage.set('jpcs_profile_views', views);
}

// Make showProfile available globally
window.showProfile = showProfile;