document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobile-btn');
    const navLinks = document.getElementById('nav-links');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Smooth Scrolling & Active State Update
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    // Close menu when link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href').includes(current)) {
                li.classList.add('active');
            }
        });
    });

    // Intersection Observer for Fade-In Animation
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    /* === Tech Cursor & Glow Setup === */
    const cursorTech = document.getElementById('custom-cursor-tech');
    const cursorGlow = document.getElementById('cursor-glow');

    // Only apply if the device supports hover
    if (window.matchMedia("(any-hover: hover)").matches) {
        document.addEventListener('mousemove', (e) => {
            // Update the tech cursor position exactly
            cursorTech.style.left = e.clientX + 'px';
            cursorTech.style.top = e.clientY + 'px';
            
            // Wait slightly so the glow effect "drags" behind
            setTimeout(() => {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            }, 50);
        });

        // Interactive hover effects
        const interactives = document.querySelectorAll('a, button, .btn, .card, .skill-bubble');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorTech.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorGlow.style.width = '600px';
                cursorGlow.style.height = '600px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(226, 232, 240, 0.12) 0%, transparent 70%)';
            });
            el.addEventListener('mouseleave', () => {
                cursorTech.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorGlow.style.width = '400px';
                cursorGlow.style.height = '400px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(226, 232, 240, 0.08) 0%, transparent 70%)';
            });
        });
    } else {
        // Hide on touch screens
        cursorTech.style.display = 'none';
        cursorGlow.style.display = 'none';
    }

    // --- 3D Background Torus ---
    const canvas = document.querySelector('#bg-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Core Torus Geometry (Complex Gyroscope Interlink) - scaled up 40%
        const geometry = new THREE.TorusGeometry(12.6, 2.1, 16, 100);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xe2e8f0, // Match the primary color
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        
        const torusGroup = new THREE.Group();

        // Torus 1 (XY Plane)
        const torus1 = new THREE.Mesh(geometry, material);
        
        // Torus 2 (XZ Plane)
        const torus2 = new THREE.Mesh(geometry, material);
        torus2.rotation.x = Math.PI / 2;
        
        // Torus 3 (YZ Plane)
        const torus3 = new THREE.Mesh(geometry, material);
        torus3.rotation.y = Math.PI / 2;
        
        torusGroup.add(torus1);
        torusGroup.add(torus2);
        torusGroup.add(torus3);
        scene.add(torusGroup);

        // Lighting
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(20, 20, 20);
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(pointLight, ambientLight);

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate the entire linked group gracefully
            torusGroup.rotation.x += 0.0015;
            torusGroup.rotation.y += 0.002;
            torusGroup.rotation.z += 0.001;
            
            // Complex independent rotations for the nested gyroscopic effect
            torus1.rotation.x -= 0.003;
            torus1.rotation.y -= 0.001;
            
            torus2.rotation.y -= 0.003;
            torus2.rotation.z -= 0.001;
            
            torus3.rotation.z -= 0.003;
            torus3.rotation.x -= 0.001;
            
            renderer.render(scene, camera);
        }
        animate();

        // Responsive Resizing
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

});
