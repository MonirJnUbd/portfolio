document.addEventListener("DOMContentLoaded", () => {
    // 1. Custom Cursor & Glow Effect
    const cursorGlow = document.getElementById('cursor-glow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor interpolation
    const renderCursor = () => {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
        requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Make glow bigger on clickable items
    const clickables = document.querySelectorAll('a, button, .magnetic-btn');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorGlow.style.width = '500px';
            cursorGlow.style.height = '500px';
            cursorGlow.style.background = 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(0,0,0,0) 70%)';
        });
        el.addEventListener('mouseleave', () => {
            cursorGlow.style.width = '400px';
            cursorGlow.style.height = '400px';
            cursorGlow.style.background = 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, rgba(0,0,0,0) 70%)';
        });
    });

    // 2. Magnetic Buttons Effect
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
            btn.style.transition = `transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)`;
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transition = `none`;
        });
    });

    // 3. Typing Effect
    const typingText = document.querySelector('.typing-text');
    const words = [
        "Operations Manager", 
        "Business Developer", 
        "Agency Founder", 
        "Strategic Thinker"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(type, typingSpeed);
    };
    
    // Start typing after a short delay
    setTimeout(type, 1000);

    // 4. Scroll Reveal & Number Counter Observer
    const revealElements = document.querySelectorAll('.reveal');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    const animateNumbers = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; 
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateNumber = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.ceil(current) + "+";
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target + "+";
                }
            };
            updateNumber();
        });
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's the stats section, trigger the counters once
                if (entry.target.classList.contains('stat-card') && !animatedStats) {
                    animatedStats = true;
                    animateNumbers();
                }
                
                // Optional: Unobserve after revealing for better performance
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
});