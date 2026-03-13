document.addEventListener("DOMContentLoaded", () => {
    
    // --- Elements ---
    const entranceScreen = document.getElementById('entrance-screen');
    const startBtn = document.getElementById('start-btn');
    const mainFeed = document.getElementById('main-feed');
    const audio = document.getElementById('bg-audio');
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');

    // --- Interaction / Entrance ---
    startBtn.addEventListener('click', () => {
        // 1. Play Audio
        audio.play().catch(e => console.log("Audio play failed:", e));
        
        // 2. Hide Entrance Screen (Slides up)
        entranceScreen.classList.add('hidden');
        
        // 3. Show Main Feed (Fades in)
        mainFeed.classList.remove('hidden');
        // Small delay to allow element to become block before transition
        setTimeout(() => {
            mainFeed.classList.add('visible');
        }, 50);

        // 4. Start Confetti Magic
        startConfetti();

        // 5. Initialize Scroll Animations
        initScrollAnimations();
    });

    // --- Scroll Animations ---
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-scroll');
                    // Optional: stop observing once revealed if you only want it to happen once
                    // observer.unobserve(entry.target); 
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of the element is visible
            rootMargin: "0px 0px -50px 0px" // Triggers slightly before the bottom
        });

        const hiddenElements = document.querySelectorAll('.hidden-scroll');
        hiddenElements.forEach((el) => observer.observe(el));
    }

    // --- Confetti / Particle System ---
    let particles = [];
    const particleCount = 100; // Festive but lightweight
    const colors = ['#d35400', '#e67e22', '#f39c12', '#f1c40f', '#e74c3c']; // Festive warm colors

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial size

    class Particle {
        constructor() {
            this.reset();
            // Stagger initial Y positions so they don't all fall at once
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -100 - 10; // Start slightly above screen
            this.size = Math.random() * 6 + 3;
            // Mixed shapes: circles and elongated confetti strips
            this.isCircle = Math.random() > 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            
            // Speed & Drift
            this.vy = Math.random() * 2 + 1; // Fall speed
            this.vx = Math.random() * 2 - 1; // Drift speed
            
            // Rotation for strips
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 5 - 2.5;
        }

        update() {
            this.y += this.vy;
            this.x += this.vx;
            this.rotation += this.rotationSpeed;

            // Simple sway
            this.x += Math.sin(this.y * 0.01) * 0.5;

            // Reset if off screen bottom
            if (this.y > canvas.height + 20) {
                this.reset();
            }
            // Wrap left/right
            if (this.x > canvas.width + 20) this.x = -20;
            if (this.x < -20) this.x = canvas.width + 20;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.8; // Slight transparency

            if (this.isCircle) {
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Draw a rectangle (confetti slip)
                ctx.fillRect(-this.size/2, -this.size, this.size, this.size * 2);
            }

            ctx.restore();
        }
    }

    function initParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateConfetti);
    }

    function startConfetti() {
        if (particles.length === 0) {
            initParticles();
            animateConfetti();
        }
    }
});
