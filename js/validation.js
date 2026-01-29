// Consolidated Form Validation and Real-time Feedback
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Shared Helper functions
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = '#d32f2f';
        }
    }

    function clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Contact Form Logic
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            let isValid = true;

            if (name.length < 3) { showError('nameError', 'Name must be at least 3 characters'); isValid = false; }
            else { clearError('nameError'); }

            if (!validateEmail(email)) { showError('emailError', 'Valid email required'); isValid = false; }
            else { clearError('emailError'); }

            if (!/^[0-9]{10}$/.test(phone)) { showError('phoneError', '10-digit phone required'); isValid = false; }
            else { clearError('phoneError'); }

            if (message.length < 10) { showError('messageError', 'Message too short'); isValid = false; }
            else { clearError('messageError'); }

            if (isValid) {
                if (typeof showToast === 'function') showToast('Message sent successfully!');
                contactForm.reset();
            }
        });
    }

    // Login Form Validation (UI feedback only, Firebase handles submission)
    if (loginForm) {
        loginForm.addEventListener('input', function (e) {
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (email && !validateEmail(email)) {
                showError('loginEmailError', 'Valid email required');
            } else {
                clearError('loginEmailError');
            }

            if (password && password.length < 8) {
                showError('loginPasswordError', '8+ characters required');
            } else {
                clearError('loginPasswordError');
            }
        });
    }

    // Signup Form Validation (UI feedback only, Firebase handles submission)
    if (signupForm) {
        signupForm.addEventListener('input', function (e) {
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value.trim();
            const confirm = document.getElementById('confirmPassword').value.trim();

            if (name && name.length < 3) showError('signupNameError', 'Name too short');
            else clearError('signupNameError');

            if (email && !validateEmail(email)) showError('signupEmailError', 'Valid email required');
            else clearError('signupEmailError');

            if (password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
                showError('signupPasswordError', 'Need uppercase, lowercase & digit');
            } else {
                clearError('signupPasswordError');
            }

            if (confirm && password !== confirm) showError('confirmPasswordError', 'Passwords mismatch');
            else clearError('confirmPasswordError');
        });
    }
});
