// membership.js - Multi-step registration form with validation

let currentStep = 1;
const totalSteps = 3;

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Load saved form data if exists
    loadFormProgress();
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                saveFormProgress();
                currentStep++;
                updateForm();
            }
        });
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentStep--;
            updateForm();
        });
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateStep(currentStep)) {
                submitForm();
            }
        });
    }
    
    // Auto-save on input
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('change', function() {
            saveFormProgress();
        });
    });
    
    // Real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
});

function updateForm() {
    // Update steps visibility
    const steps = document.querySelectorAll('.form-step');
    steps.forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update progress indicator
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }
    
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
    
    // Scroll to top of form
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
}

function validateStep(step) {
    const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
    const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Special validation for step 3 (interests checkboxes)
    if (step === 3) {
        const checkboxes = currentStepElement.querySelectorAll('input[name="interests"]:checked');
        const checkboxGroup = currentStepElement.querySelector('.checkbox-group');
        const errorMsg = checkboxGroup.parentElement.querySelector('.error-message');
        
        if (checkboxes.length === 0) {
            errorMsg.textContent = 'Please select at least one area of interest';
            errorMsg.classList.add('show');
            isValid = false;
        } else {
            errorMsg.classList.remove('show');
        }
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const errorMsg = field.parentElement.querySelector('.error-message');
    let isValid = true;
    let message = '';
    
    // Required field check
    if (field.hasAttribute('required') && !value) {
        message = 'This field is required';
        isValid = false;
    }
    
    // Email validation
    else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            message = 'Please enter a valid email address';
            isValid = false;
        }
    }
    
    // Phone validation
    else if (field.id === 'phone' && value) {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(value.replace(/[-\s]/g, ''))) {
            message = 'Please enter a valid phone number (10-11 digits)';
            isValid = false;
        }
    }
    
    // Student ID validation
    else if (field.id === 'studentId' && value) {
        if (value.length < 5) {
            message = 'Student ID must be at least 5 characters';
            isValid = false;
        }
    }
    
    // Date of birth validation (must be at least 15 years old)
    else if (field.id === 'birthdate' && value) {
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 15) {
            message = 'You must be at least 15 years old';
            isValid = false;
        }
    }
    
    // Terms checkbox
    else if (field.id === 'terms' && !field.checked) {
        message = 'You must agree to the terms and conditions';
        isValid = false;
    }
    
    // Update UI
    if (!isValid) {
        field.classList.add('error');
        if (errorMsg) {
            errorMsg.textContent = message;
            errorMsg.classList.add('show');
        }
    } else {
        field.classList.remove('error');
        if (errorMsg) {
            errorMsg.classList.remove('show');
        }
    }
    
    return isValid;
}

function saveFormProgress() {
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        birthdate: document.getElementById('birthdate').value,
        studentId: document.getElementById('studentId').value,
        course: document.getElementById('course').value,
        yearLevel: document.getElementById('yearLevel').value,
        section: document.getElementById('section').value,
        skillLevel: document.getElementById('skillLevel').value,
        expectations: document.getElementById('expectations').value,
        interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value),
        currentStep: currentStep,
        savedAt: new Date().toISOString()
    };
    
    storage.set('jpcs_registration_progress', formData);
}

function loadFormProgress() {
    const savedData = storage.get('jpcs_registration_progress');
    
    if (!savedData) return;
    
    // Check if data is not too old (7 days)
    const savedDate = new Date(savedData.savedAt);
    const now = new Date();
    const daysDiff = (now - savedDate) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > 7) {
        storage.remove('jpcs_registration_progress');
        return;
    }
    
    // Restore form data
    if (savedData.firstName) document.getElementById('firstName').value = savedData.firstName;
    if (savedData.lastName) document.getElementById('lastName').value = savedData.lastName;
    if (savedData.email) document.getElementById('email').value = savedData.email;
    if (savedData.phone) document.getElementById('phone').value = savedData.phone;
    if (savedData.birthdate) document.getElementById('birthdate').value = savedData.birthdate;
    if (savedData.studentId) document.getElementById('studentId').value = savedData.studentId;
    if (savedData.course) document.getElementById('course').value = savedData.course;
    if (savedData.yearLevel) document.getElementById('yearLevel').value = savedData.yearLevel;
    if (savedData.section) document.getElementById('section').value = savedData.section;
    if (savedData.skillLevel) document.getElementById('skillLevel').value = savedData.skillLevel;
    if (savedData.expectations) document.getElementById('expectations').value = savedData.expectations;
    
    // Restore interests
    if (savedData.interests && savedData.interests.length > 0) {
        savedData.interests.forEach(interest => {
            const checkbox = document.querySelector(`input[name="interests"][value="${interest}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    // Restore step
    if (savedData.currentStep) {
        currentStep = savedData.currentStep;
        updateForm();
    }
    
    console.log('Form progress loaded from previous session');
}

function submitForm() {
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        birthdate: document.getElementById('birthdate').value,
        studentId: document.getElementById('studentId').value,
        course: document.getElementById('course').value,
        yearLevel: document.getElementById('yearLevel').value,
        section: document.getElementById('section').value,
        skillLevel: document.getElementById('skillLevel').value,
        expectations: document.getElementById('expectations').value,
        interests: Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value),
        submittedAt: new Date().toISOString()
    };
    
    // Save to localStorage (in a real app, this would be sent to a server)
    const submissions = storage.get('jpcs_submissions') || [];
    submissions.push(formData);
    storage.set('jpcs_submissions', submissions);
    
    // Clear form progress
    storage.remove('jpcs_registration_progress');
    
    // Show success message
    document.getElementById('registrationForm').style.display = 'none';
    document.querySelector('.form-header').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    
    // Scroll to success message
    document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth' });
    
    console.log('Registration submitted:', formData);
}

// Save membership page visit
const membershipVisits = storage.get('jpcs_membership_visits') || 0;
storage.set('jpcs_membership_visits', membershipVisits + 1);