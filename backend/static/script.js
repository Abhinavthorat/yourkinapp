// Atmosphere Script

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Simple Form Handling (Retaining logic, simplified interaction)
// Email Submission
// Email Submission
const form = document.getElementById('signupForm');
// Relative URL for same-origin (Flask serving site)
const API_URL = '/api/signup';

if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const input = this.querySelector('input');
        const button = this.querySelector('button');
        const email = input.value;

        if (email) {
            // Loading State
            button.textContent = '...';
            button.disabled = true;
            input.disabled = true;

            try {
                // Submit to Flask Backend
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || 'Network error');
                }

                // Simulate slight network delay for "premium" feel (optional)
                await new Promise(r => setTimeout(r, 600));

                // Success State - "We'll get back to you"
                button.textContent = "We'll get back to you.";
                button.style.color = '#fff';
                input.style.opacity = '0.5';

                console.log('Email captured:', email);

            } catch (error) {
                console.error('Error:', error);
                button.textContent = 'Retry';
                button.disabled = false;
                input.disabled = false;
            }
        }
    });
}
