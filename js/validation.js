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

    // Login Form Logic
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            let isValid = true;

            if (!validateEmail(email)) { showError('loginEmailError', 'Valid email required'); isValid = false; }
            else { clearError('loginEmailError'); }

            if (password.length < 8) { showError('loginPasswordError', '8+ characters required'); isValid = false; }
            else { clearError('loginPasswordError'); }

            if (isValid) {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    if (typeof showToast === 'function') showToast('Login successful!');
                    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
                } else {
                    showError('loginPasswordError', 'Invalid credentials');
                }
            }
        });
    }

    // Signup Form Logic
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value.trim();
            const confirm = document.getElementById('confirmPassword').value.trim();
            let isValid = true;

            if (name.length < 3) { showError('signupNameError', 'Name too short'); isValid = false; }
            else { clearError('signupNameError'); }

            if (!validateEmail(email)) { showError('signupEmailError', 'Valid email required'); isValid = false; }
            else {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                if (users.some(u => u.email === email)) { showError('signupEmailError', 'Already registered'); isValid = false; }
                else { clearError('signupEmailError'); }
            }

            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
                showError('signupPasswordError', 'Need uppercase, lowercase & digit'); isValid = false;
            } else { clearError('signupPasswordError'); }

            if (password !== confirm) { showError('confirmPasswordError', 'Passwords mismatch'); isValid = false; }
            else { clearError('confirmPasswordError'); }

            if (isValid) {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                users.push({ name, email, password });
                localStorage.setItem('users', JSON.stringify(users));
                if (typeof showToast === 'function') showToast('Account created!');
                setTimeout(() => {
                    const loginTab = document.getElementById('loginTab');
                    if (loginTab) loginTab.click();
                    signupForm.reset();
                }, 1000);
            }
        });
    }
});
