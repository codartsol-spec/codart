/* =============================================
   CODART ™ — Main JavaScript
   Particles · Typed Text · Scroll Animations
   Pricing Tabs · Testimonials · Counter
   ============================================= */

(function () {
    'use strict';

    /* ── Page Loader ──────────────────────────── */
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loader = document.getElementById('page-loader');
            if (loader) loader.classList.add('fade-out');
            // Kick off hero animations after loader
            initHeroAnimations();
        }, 800);
    });

    /* ── Custom Cursor ────────────────────────── */
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    if (dot && ring) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        // Smooth ring follow
        (function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        })();

        // Hover effect on interactive elements
        document.querySelectorAll('a, button, .btn, .glass-card, .pricing-tab, .t-btn').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
        });
    }

    /* ── Particles Canvas ─────────────────────── */
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];
        const COUNT = 80;

        function resize() {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        function Particle() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r = Math.random() * 1.5 + 0.5;
            this.alpha = Math.random() * 0.4 + 0.1;
        }

        for (let i = 0; i < COUNT; i++) particles.push(new Particle());

        function draw() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach((p, i) => {
                // Update
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;

                // Draw dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201,162,39,${p.alpha})`;
                ctx.fill();

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x, dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(201,162,39,${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(draw);
        }
        draw();
    }
    initParticles();

    /* ── Navbar Scroll ────────────────────────── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        updateActiveNav();
    }, { passive: true });

    /* ── Mobile Nav ───────────────────────────── */
    const toggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    window.closeMobile = function () {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    };

    /* ── Active Nav on Scroll ─────────────────── */
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id], .stats-strip');
        const navAs = document.querySelectorAll('.nav-links a:not(.nav-cta)');
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 100) current = s.id;
        });
        navAs.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) a.classList.add('active');
        });
    }

    /* ── Typed Text ───────────────────────────── */
    const phrases = [
        'convert traffic.',
        'build brands.',
        'impress clients.',
        'drive growth.',
    ];
    let phraseIdx = 0, charIdx = 0, deleting = false;
    const typedEl = document.getElementById('typed-text');

    function typeLoop() {
        if (!typedEl) return;
        const phrase = phrases[phraseIdx];
        if (!deleting) {
            typedEl.textContent = phrase.slice(0, ++charIdx);
            if (charIdx === phrase.length) {
                deleting = true;
                setTimeout(typeLoop, 2000);
                return;
            }
        } else {
            typedEl.textContent = phrase.slice(0, --charIdx);
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
            }
        }
        setTimeout(typeLoop, deleting ? 55 : 110);
    }

    function initHeroAnimations() {
        // Stagger hero line-inner elements
        document.querySelectorAll('.hero-title .line-inner').forEach((el, i) => {
            el.style.transform = 'translateY(100%)';
            el.style.transition = `transform 0.9s cubic-bezier(0.25,0.8,0.25,1) ${i * 0.12}s`;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => { el.style.transform = 'translateY(0)'; });
            });
        });
        // start typing after hero reveals
        setTimeout(typeLoop, 900);
        // fade in hero extras
        const extras = document.querySelectorAll('.hero-badge, .hero-description, .hero-cta-group, .hero-scroll-indicator');
        extras.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.8s ease ${0.5 + i * 0.15}s, transform 0.8s ease ${0.5 + i * 0.15}s`;
            requestAnimationFrame(() => requestAnimationFrame(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }));
        });
    }

    /* ── Scroll Reveal ────────────────────────── */
    const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
    const revealEls = document.querySelectorAll(revealClasses.join(','));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ── Counter Animation ────────────────────── */
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                const duration = 1800;
                const start = performance.now();
                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out quint
                    const eased = 1 - Math.pow(1 - progress, 5);
                    el.textContent = Math.round(eased * target);
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));

    /* ── Pricing Tabs ─────────────────────────── */
    const tabs = document.querySelectorAll('.pricing-tab');
    const panels = document.querySelectorAll('.pricing-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const id = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => {
                p.classList.remove('active');
                // Reset animations
                p.querySelectorAll('.reveal-scale').forEach(el => el.classList.remove('visible'));
            });
            tab.classList.add('active');
            const panel = document.getElementById('tab-' + id);
            if (panel) {
                panel.classList.add('active');
                setTimeout(() => {
                    panel.querySelectorAll('.reveal-scale').forEach(el => {
                        revealObserver.observe(el);
                    });
                }, 10);
            }
        });
    });

    /* ── Testimonials Carousel ────────────────── */
    const track = document.getElementById('testimonialsTrack');
    const dots = document.querySelectorAll('.t-dot');
    let current = 0;
    const total = 5;
    let autoTimer;

    function goTo(idx) {
        current = (idx + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startAuto() {
        autoTimer = setInterval(() => goTo(current + 1), 5000);
    }
    function resetAuto() {
        clearInterval(autoTimer);
        startAuto();
    }

    document.getElementById('tNext').addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    document.getElementById('tPrev').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.index); resetAuto(); }));

    // Touch swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
    track.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) { goTo(dx < 0 ? current + 1 : current - 1); resetAuto(); }
    });

    startAuto();

    /* ── Contact Form (EmailJS) ───────────────── */
    window.handleSubmit = function (e) {
        e.preventDefault();

        const btn = document.getElementById('submitBtn');
        const form = document.getElementById('contactForm');

        // Collect form data
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const serviceVal = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();

        const serviceLabels = {
            web: 'Web Development',
            brand: 'Logo & Brand Identity',
            social: 'Social Media Design',
            bundle: 'Full Bundle (All Services)'
        };

        // Loading state
        btn.disabled = true;
        btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 0.8s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Sending…</span>';

        // ── EmailJS IDs — fill these in after setting up at emailjs.com ──
        const SERVICE_ID = 'service_wive0hc';   // e.g. 'service_abc123'
        const TEMPLATE_ID = 'template_88skngm';  // e.g. 'template_xyz789'

        emailjs.send(SERVICE_ID, TEMPLATE_ID, {
            from_name: `${firstName} ${lastName}`,
            from_email: email,
            service_type: serviceLabels[serviceVal] || serviceVal,
            message: message,
            to_email: 'codart.sol@gmail.com',
            reply_to: email,
        })
            .then(function () {
                // Success
                btn.innerHTML = '✓ Message Sent!';
                btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
                form.reset();
                setTimeout(() => {
                    btn.textContent = 'Send Message ✦';
                    btn.style.background = '';
                    btn.disabled = false;
                }, 5000);
            })
            .catch(function (error) {
                // Error
                console.error('EmailJS error:', error);
                btn.innerHTML = '✗ Failed — Try Again';
                btn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
                btn.disabled = false;
                setTimeout(() => {
                    btn.textContent = 'Send Message ✦';
                    btn.style.background = '';
                }, 4000);
            });
    };

    /* ── Parallax subtle glow ────────────────── */
    window.addEventListener('mousemove', e => {
        const glow1 = document.querySelector('.hero-bg-glow.glow-1');
        const glow2 = document.querySelector('.hero-bg-glow.glow-2');
        if (!glow1 || !glow2) return;
        const rx = (e.clientX / window.innerWidth - 0.5) * 30;
        const ry = (e.clientY / window.innerHeight - 0.5) * 30;
        glow1.style.transform = `translate(${rx}px, ${ry * 0.5}px)`;
        glow2.style.transform = `translate(${-rx * 0.5}px, ${-ry}px)`;
    }, { passive: true });

    /* ── Portfolio Tabs ───────────────────────── */
    const pfBtns = document.querySelectorAll('.pf-btn');
    const pfPanels = document.querySelectorAll('.pf-panel');

    pfBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            pfBtns.forEach(b => b.classList.remove('active'));
            pfPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.dataset.pfTab;
            const panel = document.getElementById('pf-' + tabId);
            if (panel) {
                panel.classList.add('active');
                // Re-trigger scroll animations for newly visible items
                panel.querySelectorAll('.reveal-scale').forEach(el => {
                    el.classList.remove('visible');
                    setTimeout(() => revealObserver.observe(el), 10);
                });
            }
        });
    });

})();

