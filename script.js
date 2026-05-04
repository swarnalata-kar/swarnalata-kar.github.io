document.addEventListener('DOMContentLoaded', () => {
    // ── Lenis Smooth Scroll ─────────────────────────────────────────
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }

    // Current Year for Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Theme Selector Logic ---
    const themeBtn = document.getElementById('theme-btn');
    const themeDropdown = document.getElementById('theme-dropdown');
    const themeOptions = document.querySelectorAll('.theme-option');

    // Load saved theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('show');
            // Hide the "Customise" hint forever after first click
            const hint = document.getElementById('theme-hint');
            if (hint) hint.classList.add('hidden');
        });

        document.addEventListener('click', () => {
            themeDropdown.classList.remove('show');
        });

        themeOptions.forEach(option => {
            if (option.getAttribute('data-set-theme') === savedTheme) {
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            }

            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-set-theme');
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('portfolio-theme', theme);
                
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                
                // Update Cursor Graphic
                if(window.updateCustomCursor) {
                    window.updateCustomCursor(theme);
                }

                // Toggle Petals
                if(window.petalSystem) {
                    if(theme === 'lavender-wisteria' || theme === 'spider-lily' || theme === 'sapphire-bloom' || theme === 'cherry-blossom') {
                        window.petalSystem.start();
                    } else {
                        window.petalSystem.stop();
                    }
                }
            });
        });
    }

    // ── Pixel-Perfect Subject Hover Detection ─────────────────────────
    // Canvas getImageData is blocked on file:// by CORS.
    // Instead, we use an ellipse hit-test mapped to her body proportions
    // derived from the actual PNG dimensions (3072x1727, body: x887-1899, y219-1727).
    const heroSection = document.getElementById('home');
    const subjectImg  = document.querySelector('.hero-subject-png');

    if (heroSection && subjectImg) {
        // Her body centre & radius as fractions of the PNG dimensions
        const bodyCx = (887 + 1899) / 2 / 3072; // ~0.453
        const bodyCy = (219 + 1727) / 2 / 1727;  // ~0.563
        const bodyRx = (1899 - 887) / 2 / 3072;  // ~0.165  (half-width)
        const bodyRy = (1727 - 219) / 2 / 1727;  // ~0.437  (half-height)

        heroSection.addEventListener('mousemove', (e) => {
            const rect = subjectImg.getBoundingClientRect();
            // Cursor relative to the image element (0-1 fractions)
            const fx = (e.clientX - rect.left)  / rect.width;
            const fy = (e.clientY - rect.top)   / rect.height;

            // Standard ellipse equation: (dx/rx)² + (dy/ry)² <= 1
            const dx = (fx - bodyCx) / bodyRx;
            const dy = (fy - bodyCy) / bodyRy;
            const inside = (dx * dx + dy * dy) <= 1;

            heroSection.classList.toggle('subject-hovered', inside);
        });

        heroSection.addEventListener('mouseleave', () => {
            heroSection.classList.remove('subject-hovered');
        });
    }

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if(navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links li a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if(hamburger) {
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Typing Animation
    const typedTextSpan = document.getElementById("typed-text");
    const cursorSpan = document.querySelector(".cursor");

    const textArray = ["Aspiring DevOps Engineer", "Cloud Enthusiast", "Automation Expert"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if(!typedTextSpan || !cursorSpan) return;
        if (charIndex < textArray[textArrayIndex].length) {
            if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if(!typedTextSpan || !cursorSpan) return;
        if (charIndex > 0) {
            if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if(textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if(textArray.length && typedTextSpan) setTimeout(type, newTextDelay + 250);

    // Scroll Animation with Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(element => {
        observer.observe(element);
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if(!navbar) return;
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 15, 22, 0.9)';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(19, 26, 36, 0.6)';
            navbar.style.boxShadow = 'none';
        }
    });

    // --- Custom Cursor Logic ---
    const customCursor = document.getElementById('custom-cursor');
    
    if (customCursor) {
        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
        });

        // Add hover effect on clickable elements
        const clickables = document.querySelectorAll('a, button, .theme-option, .hero-subject-png');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                customCursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });

        // Hide cursor when mouse leaves the window
        document.addEventListener('mouseleave', () => {
            customCursor.style.opacity = '0';
        });
        document.addEventListener('mousemove', () => {
            customCursor.style.opacity = '1';
        }, { once: false });

        window.updateCustomCursor = (theme) => {
            // Reset styles
            customCursor.style.backgroundImage = 'none';
            customCursor.style.backgroundColor = 'transparent';
            
            if (theme === 'spider-lily') {
                customCursor.style.backgroundImage = "url('spider_lily.png')";
            } else if (theme === 'lavender-wisteria') {
                customCursor.style.backgroundImage = "url('wisteria.png')";
            } else if (theme === 'sapphire-bloom') {
                customCursor.style.backgroundImage = "url('sapphire_bloom.png')";
            } else if (theme === 'cherry-blossom') {
                customCursor.style.backgroundImage = "url('midnight_sakura.png')";
            } else {
                // Not a floral theme, use theme's accent color for the dot
                // we can just use CSS variable since it will update automatically,
                // but we need to restore the background color property
                customCursor.style.backgroundColor = 'var(--accent-cyan)';
            }
        };

        // Init cursor
        window.updateCustomCursor(savedTheme);
    }

    // ── GSAP: Cinematic Entry Timeline ────────────────────────────────
    if (typeof gsap !== 'undefined') {

        // Register ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        // 1. Background watermark text
        tl.from(".hero-bg-text", { 
            y: 80, opacity: 0, duration: 1.8, delay: 0.1
        })
        // 2. Left column tag + socials
        .from("#hero-tag", { 
            y: 40, opacity: 0, duration: 1.2
        }, "-=1.4")
        .from("#hero-socials a", { 
            y: 20, opacity: 0, stagger: 0.15, duration: 0.8
        }, "-=0.8")
        // 3. Image rises up
        .from("#hero-subject-img", { 
            y: 120, opacity: 0, duration: 1.6, ease: "power3.out"
        }, "-=1.2")
        // 4. Role label
        .to("#hero-role", { 
            opacity: 1, y: 0, duration: 0.8
        }, "-=1.0")
        // 5. Name lines stagger up (clip reveal) - REMOVED
        // 6. CTA buttons
        .from("#hero-cta a", { 
            y: 20, opacity: 0, stagger: 0.15, duration: 0.8
        }, "-=0.6")
        // 7. Bottom bar
        .from(".hero-bottom", { 
            y: 20, opacity: 0, duration: 0.8
        }, "-=0.5");

        // ── Scroll Animations for About & Skills ────────────────────────
        if (typeof ScrollTrigger !== 'undefined') {
            // (Removed section-based parallax graphics to keep the design clean)

            // Fade in sections with more vibe
            gsap.from(".about-content", {
                scrollTrigger: {
                    trigger: ".about",
                    start: "top 75%"
                },
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out"
            });

            gsap.from(".skills-grid", {
                scrollTrigger: {
                    trigger: ".skills",
                    start: "top 75%"
                },
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out"
            });
        }

        // ── Petal System (Falling Sakura/Wisteria) ─────────────────────
        class PetalSystem {
            constructor() {
                this.canvas = document.getElementById('petals-canvas');
                if (!this.canvas) return;
                this.ctx = this.canvas.getContext('2d');
                this.petals = [];
                this.isActive = false;
                this.resize();
                window.addEventListener('resize', () => this.resize());
                this.animate = this.animate.bind(this);
            }

            resize() {
                this.width = window.innerWidth;
                this.height = window.innerHeight;
                this.canvas.width = this.width;
                this.canvas.height = this.height;
            }

            createPetal() {
                return {
                    x: Math.random() * this.width,
                    y: -20 - Math.random() * 50,
                    size: Math.random() * 6 + 4,
                    speedY: Math.random() * 1.5 + 0.5,
                    speedX: Math.random() * 2 - 1,
                    rotation: Math.random() * 360,
                    rotationSpeed: Math.random() * 4 - 2,
                    oscillationSpeed: Math.random() * 0.05 + 0.02,
                    oscillationAmplitude: Math.random() * 1.5 + 0.5,
                    time: Math.random() * 100,
                    // Colors depend on theme (set when creating petal)
                    color: document.documentElement.getAttribute('data-theme') === 'spider-lily' 
                           ? `rgba(201, 31, 55, ${Math.random() * 0.5 + 0.3})`
                           : document.documentElement.getAttribute('data-theme') === 'sapphire-bloom'
                           ? `rgba(135, 206, 250, ${Math.random() * 0.5 + 0.3})`
                           : document.documentElement.getAttribute('data-theme') === 'cherry-blossom'
                           ? `rgba(255, 183, 197, ${Math.random() * 0.5 + 0.3})`
                           : `rgba(156, 113, 217, ${Math.random() * 0.5 + 0.3})`
                };
            }

            start() {
                if (this.isActive) return;
                this.isActive = true;
                this.canvas.style.opacity = '1';
                
                // Initialize a batch
                this.petals = [];
                for(let i=0; i<40; i++) {
                    const p = this.createPetal();
                    p.y = Math.random() * this.height; // Start some on screen
                    this.petals.push(p);
                }
                requestAnimationFrame(this.animate);
            }

            stop() {
                this.isActive = false;
                this.canvas.style.opacity = '0';
            }

            animate() {
                if (!this.isActive) return;
                this.ctx.clearRect(0, 0, this.width, this.height);

                for(let i=0; i<this.petals.length; i++) {
                    const p = this.petals[i];
                    p.time += p.oscillationSpeed;
                    
                    // Movement
                    p.y += p.speedY;
                    p.x += p.speedX + Math.sin(p.time) * p.oscillationAmplitude;
                    p.rotation += p.rotationSpeed;

                    // Draw
                    this.ctx.save();
                    this.ctx.translate(p.x, p.y);
                    this.ctx.rotate((p.rotation * Math.PI) / 180);
                    
                    this.ctx.beginPath();
                    this.ctx.fillStyle = p.color;
                    
                    // Draw a petal shape using bezier curves
                    this.ctx.moveTo(0, -p.size);
                    this.ctx.bezierCurveTo(p.size, -p.size, p.size, p.size, 0, p.size);
                    this.ctx.bezierCurveTo(-p.size, p.size, -p.size, -p.size, 0, -p.size);
                    
                    this.ctx.fill();
                    this.ctx.restore();

                    // Reset if out of bounds
                    if (p.y > this.height + p.size) {
                        this.petals[i] = this.createPetal();
                    }
                }
                requestAnimationFrame(this.animate);
            }
        }

        window.petalSystem = new PetalSystem();
        
        // Start petals immediately if the active theme is floral
        if(savedTheme === 'lavender-wisteria' || savedTheme === 'spider-lily' || savedTheme === 'sapphire-bloom' || savedTheme === 'cherry-blossom') {
            window.petalSystem.start();
        }

        // ── Mouse Tilt on Subject Image ────────────────────────────────
        const hero = document.getElementById('home');
        const imgWrap = document.getElementById('hero-img-wrap');

        if (hero && imgWrap) {
            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                const xPos = (e.clientX - rect.left) / rect.width - 0.5;
                const yPos = (e.clientY - rect.top) / rect.height - 0.5;

                gsap.to(imgWrap, {
                    rotateY: xPos * 12,
                    rotateX: -yPos * 8,
                    x: xPos * 20,
                    y: yPos * 10,
                    duration: 0.8,
                    ease: "power2.out",
                    transformPerspective: 800,
                });
            });

            hero.addEventListener('mouseleave', () => {
                gsap.to(imgWrap, {
                    rotateY: 0, rotateX: 0, x: 0, y: 0,
                    duration: 1.2, ease: "elastic.out(1, 0.5)"
                });
            });
        }

        // ── Custom Cursor ─────────────────────────────────────────
        const cursor = document.querySelector('.custom-cursor');
        const cursorFollower = document.querySelector('.custom-cursor-follower');

        if (cursor && cursorFollower) {
            let posX = 0, posY = 0;
            let mouseX = 0, mouseY = 0;

            gsap.to({}, 0.016, {
                repeat: -1,
                onRepeat: function() {
                    posX += (mouseX - posX) / 5;
                    posY += (mouseY - posY) / 5;

                    gsap.set(cursorFollower, {
                        css: {
                            left: posX,
                            top: posY
                        }
                    });
                    gsap.set(cursor, {
                        css: {
                            left: mouseX,
                            top: mouseY
                        }
                    });
                }
            });

            document.addEventListener("mousemove", function(e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                // Show cursors on first move inside window
                cursor.classList.add('visible');
                cursorFollower.classList.add('visible');
            });

            // Hide when mouse exits the browser window
            document.addEventListener('mouseleave', () => {
                cursor.classList.remove('visible');
                cursorFollower.classList.remove('visible');
            });

            const hoverElements = document.querySelectorAll("a, button, .hero-subject-png, .theme-option");
            hoverElements.forEach(el => {
                el.addEventListener("mouseenter", () => {
                    cursor.classList.add("hover");
                    cursorFollower.classList.add("hover");
                });
                el.addEventListener("mouseleave", () => {
                    cursor.classList.remove("hover");
                    cursorFollower.classList.remove("hover");
                });
            });
        }
        // ── Contact Form → Formspree ───────────────────────────────────
        const contactForm = document.getElementById('contact-form');
        const formStatus  = document.getElementById('form-status');
        const submitBtn   = document.getElementById('form-submit-btn');

        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Button loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Sending… <i class="fas fa-spinner fa-spin"></i>';
                formStatus.className = 'form-status';
                formStatus.textContent = '';

                try {
                    const response = await fetch('https://formspree.io/f/xqenpqrr', {
                        method: 'POST',
                        headers: { 'Accept': 'application/json' },
                        body: new FormData(contactForm)
                    });

                    if (response.ok) {
                        formStatus.className = 'form-status form-status--success';
                        formStatus.textContent = '✓ Message sent! I\'ll get back to you soon.';
                        contactForm.reset();
                    } else {
                        const data = await response.json();
                        const errMsg = data.errors
                            ? data.errors.map(err => err.message).join(', ')
                            : 'Something went wrong. Please try again.';
                        formStatus.className = 'form-status form-status--error';
                        formStatus.textContent = '✕ ' + errMsg;
                    }
                } catch (err) {
                    formStatus.className = 'form-status form-status--error';
                    formStatus.textContent = '✕ Network error. Please check your connection.';
                }

                // Restore button
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
            });
        }
    }
});
