document.addEventListener('DOMContentLoaded', () => {

    // 1. Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.trigger-fade').forEach(el => {
        observer.observe(el);
    });

    // 2. Rolling Number Animation (Casino Shuffle)
    const rollingNumber = document.querySelector('.rolling-number');

    // Add to observer to trigger only when visible
    if (rollingNumber) {
        observer.observe(rollingNumber.parentElement); // Observe the wrapper
    }

    // Modify observer to handle the animation trigger
    // We need a specific observer for this or check class in existing one
    // Let's attach a specific logic to the existing observer loop

    // Re-defining observer to handle both fade-ins and the number roll
    const casinoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('number-wrapper') || entry.target.querySelector('.rolling-number')) {
                    startCasinoRoll(entry.target.querySelector('.rolling-number') || entry.target);
                    casinoObserver.unobserve(entry.target); // Run once
                }
            }
        });
    }, observerOptions);

    if (rollingNumber) {
        casinoObserver.observe(rollingNumber.parentElement);
    }

    function startCasinoRoll(element) {
        // Generate a random target between 4000 and 9000
        const target = Math.floor(Math.random() * (9000 - 4000 + 1) + 4000);
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = elapsed / duration;

            if (progress < 1) {
                // Show random number during animation
                const randomVal = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
                element.textContent = randomVal.toLocaleString();

                // Slow down the frame rate as we get closer to look like a wheel slowing down?
                // For simplicity, just high speed random shuffle
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
        requestAnimationFrame(update);
    }

    // 3. Google Forms Submission (Mock setup - needs user config)
    const form = document.getElementById('waitlistForm');

    // TODO: USER MUST REPLACE THESE VALUES
    const GOOGLE_FORM_ACTION_URL = 'YOUR_GOOGLE_FORM_ACTION_URL_HERE';
    const EMAIL_FIELD_ENTRY_ID = 'entry.YOUR_ENTRY_ID_HERE';

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email');
            const btn = form.querySelector('.btn-submit');
            const email = emailInput.value;

            if (!validateEmail(email)) return;

            // UI Loading State
            const originalBtnContent = btn.innerHTML;
            btn.innerHTML = '<span style="opacity:0.5">...</span>';
            btn.disabled = true;
            emailInput.disabled = true;

            try {
                // If ID is not configured, simulate success for demo purposes
                if (GOOGLE_FORM_ACTION_URL.includes('YOUR_GOOGLE_FORM')) {
                    console.log('Demo Mode: Simulating submission');
                    await new Promise(r => setTimeout(r, 1000));
                } else {
                    // Actual Form Submission
                    const formData = new FormData();
                    formData.append(EMAIL_FIELD_ENTRY_ID, email);

                    await fetch(GOOGLE_FORM_ACTION_URL, {
                        method: 'POST',
                        mode: 'no-cors', // Important for Google Forms
                        body: formData
                    });
                }

                // Success UI
                form.querySelector('.input-group').style.display = 'none';
                form.querySelector('.success-message').classList.remove('hidden');

            } catch (error) {
                console.error('Submission error:', error);
                btn.innerHTML = originalBtnContent;
                btn.disabled = false;
                emailInput.disabled = false;
                alert('Something went wrong. Please try again.');
            }
        });
    }

    function validateEmail(email) {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }
});
