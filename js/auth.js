/**
 * Vensysco Cloud - Authentication Module
 * Handles login/signup form validation and API communication
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const passwordToggle = document.querySelectorAll('.password-toggle');
    
    // Initialize modules
    if (loginForm) initLogin();
    if (signupForm) initSignup();
    initPasswordToggle();

    // Shared Functions
    function showAlert(type, message, targetForm) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        const existingAlert = targetForm.querySelector('.alert');
        if (existingAlert) existingAlert.remove();
        
        targetForm.insertBefore(alertDiv, targetForm.firstChild);
        
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
    }

    function togglePassword(inputId, icon) {
        const input = document.getElementById(inputId);
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    }

    function initPasswordToggle() {
        passwordToggle.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const inputId = e.target.getAttribute('data-target');
                togglePassword(inputId, e.target);
            });
        });
    }

    // Login Functions
    function initLogin() {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember').checked;
            
            // Validation
            if (!validateEmail(email)) {
                return showAlert('error', 'Please enter a valid email address', loginForm);
            }
            
            if (password.length < 8) {
                return showAlert('error', 'Password must be at least 8 characters', loginForm);
            }
            
            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            
            try {
                // Replace with actual API call
                const response = await mockLoginAPI(email, password);
                
                if (response.success) {
                    showAlert('success', 'Login successful! Redirecting...', loginForm);
                    // Store token if remember me is checked
                    if (rememberMe) {
                        localStorage.setItem('vensysco_token', response.token);
                    } else {
                        sessionStorage.setItem('vensysco_token', response.token);
                    }
                    // Redirect to dashboard
                    setTimeout(() => window.location.href = 'dashboard.html', 1500);
                } else {
                    showAlert('error', response.message || 'Invalid credentials', loginForm);
                }
            } catch (error) {
                showAlert('error', 'Network error. Please try again.', loginForm);
                console.error('Login error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login';
            }
        });
    }

    // Signup Functions
    function initSignup() {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('fullname').value.trim(),
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirm-password').value,
                terms: document.getElementById('terms').checked
            };
            
            // Validation
            if (!formData.name) {
                return showAlert('error', 'Full name is required', signupForm);
            }
            
            if (!validateEmail(formData.email)) {
                return showAlert('error', 'Please enter a valid email address', signupForm);
            }
            
            if (formData.password.length < 8) {
                return showAlert('error', 'Password must be at least 8 characters', signupForm);
            }
            
            if (formData.password !== formData.confirmPassword) {
                return showAlert('error', 'Passwords do not match', signupForm);
            }
            
            if (!formData.terms) {
                return showAlert('error', 'You must accept the terms and conditions', signupForm);
            }
            
            // Show loading state
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
            
            try {
                // Replace with actual API call
                const response = await mockSignupAPI(formData);
                
                if (response.success) {
                    showAlert('success', 'Account created successfully! Redirecting...', signupForm);
                    // Store token and redirect
                    localStorage.setItem('vensysco_token', response.token);
                    setTimeout(() => window.location.href = 'dashboard.html', 1500);
                } else {
                    showAlert('error', response.message || 'Registration failed', signupForm);
                }
            } catch (error) {
                showAlert('error', 'Network error. Please try again.', signupForm);
                console.error('Signup error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Account';
            }
        });
    }

    // Helper Functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Mock API Functions (Replace with real API calls)
    async function mockLoginAPI(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate API response
                if (email === 'demo@vensysco.com' && password === 'Password123') {
                    resolve({
                        success: true,
                        token: 'mock_jwt_token_123456',
                        user: {
                            id: 1,
                            name: 'Demo User',
                            email: email
                        }
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid email or password'
                    });
                }
            }, 800); // Simulate network delay
        });
    }

    async function mockSignupAPI(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate API response
                resolve({
                    success: true,
                    token: 'mock_jwt_token_789012',
                    user: {
                        id: 2,
                        name: formData.name,
                        email: formData.email
                    }
                });
            }, 1000);
        });
    }
});