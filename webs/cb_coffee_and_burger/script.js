window.addEventListener('DOMContentLoaded', () => {
    // 0. INICIALIZACIÓN DE PLUGINS
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    ScrollTrigger.config({ limitCallbacks: true });

    // 1. BACKGROUND 3D CON THREE.JS
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    const container = document.getElementById('canvas-container');
    const hasVideo = "NONE" !== "NONE";
    const useCanvasSequence = "true" === "true";
    let firstFrameLoaded = false;

    if (container && !useCanvasSequence) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x121212, hasVideo ? 0 : 1); // Transparente si hay video
        // IMPORTANTE: Permitir que el scroll pase a través del canvas en móviles
        renderer.domElement.style.touchAction = 'auto';
        container.appendChild(renderer.domElement);
    }

    // 1.1 OBJETO 3D ORIGINAL (Nudo Elegante)
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    if (geometry && !hasVideo && !useCanvasSequence) {
        // Sistema de Partículas Global para fondos sin video
        const material = new THREE.PointsMaterial({
            size: 0.08,
            color: 0xFFD700,
            transparent: true,
            opacity: 0.8
        });

        const bannerObject = new THREE.Points(geometry, material);
        scene.add(bannerObject);
        window.bannerObject = bannerObject;
    }

    // Luces
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(10, 20, 10);
    scene.add(mainLight);

    const fillLight = new THREE.PointLight(0xffffff, 0.8);
    fillLight.position.set(-15, -10, 15);
    scene.add(fillLight);

    // Luz de hemisferio: simula reflejos del "cielo" y "suelo" para dar volumen
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
    scene.add(hemiLight);

    camera.position.z = 18; // Más cerca para que el objeto se vea más grande

    function animate() {
        requestAnimationFrame(animate);

        if (window.bannerObject && !useCanvasSequence) {
            const time = Date.now() * 0.001;
            window.bannerObject.rotation.x += 0.005;
            window.bannerObject.rotation.y += 0.005;
            window.bannerObject.rotation.z += 0.002;

            // Efecto de flotación orgánica
            window.bannerObject.position.x += (Math.cos(time * 0.5) * 5 - window.bannerObject.position.x) * 0.03;
            window.bannerObject.position.y += (Math.sin(time * 0.5) * 4 - window.bannerObject.position.y) * 0.03;
        }
        if (!useCanvasSequence) {
            renderer.render(scene, camera);
        }
    }

    // 1.2 ANIMACIÓN DE SECUENCIA DE IMÁGENES (APPLE STYLE)
    if (useCanvasSequence) {
        const canvas = document.getElementById('hero-canvas');
        if (canvas) {
            const context = canvas.getContext('2d');
            const frameCount = parseInt("0") || 90; // Fallback a 90 si no se detecta

            // Generar rutas de frames (asumiendo formato frames/frame_0001.webp)
            const currentFrame = index => (`frames_hamburguesa/frame_${(index + 1).toString().padStart(4, '0')}.webp`);

            const images = [];
            const sequence = { frame: 0 }; // Aseguramos base 0
            let lastRenderedFrame = -1;
            let renderData = { x: 0, y: 0, w: 0, h: 0 };
            let lastWidth = window.innerWidth;
            let lastHeight = window.innerHeight;

            // Crear grano de película animado para realismo cinematográfico
            const grainOverlay = document.createElement('div');
            Object.assign(grainOverlay.style, {
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                zIndex: '2',
                pointerEvents: 'none',
                opacity: '0.04',
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            });
            canvas.parentElement.appendChild(grainOverlay);

            gsap.to(grainOverlay, {
                repeat: -1,
                duration: 0.1,
                x: () => Math.random() * 80,
                y: () => Math.random() * 80,
                ease: "none"
            });

            // Optimización: Carga prioritaria del primer frame
            const loadImages = () => {
                for (let i = 0; i < frameCount; i++) {
                    const img = new Image();
                    img.src = currentFrame(i);

                    if (i === 0) {
                        img.onerror = () => {
                            console.warn("No se pudo cargar el frame inicial. Iniciando fallback.");
                            firstFrameLoaded = true;
                            startExperience();
                        };
                    }

                    images.push(img);
                    if (i === 0) {
                        img.onload = () => {
                            if (firstFrameLoaded) return;
                            firstFrameLoaded = true;
                            resizeCanvas();
                            render(true);
                            // Hacemos el canvas visible inmediatamente después de renderizar el primer frame
                            canvas.style.opacity = "1";

                            // Asegurar que la experiencia inicie correctamente
                            setTimeout(startExperience, 150);
                            window.dispatchEvent(new Event('framesReady'));
                        };
                        if (img.complete) img.onload();
                    }
                }
            };

            canvas.style.opacity = "0"; // Iniciar oculto para el fade-in
            loadImages();

            function render(force = false) {
                // Convertimos el float de GSAP a un entero válido
                const frameIndex = Math.round(sequence.frame);

                // Guard: Evitamos redibujar si estamos en el mismo frame
                if (!force && frameIndex === lastRenderedFrame) return;

                const img = images[frameIndex];
                if (!img || !img.complete) return;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, renderData.x, renderData.y, renderData.w, renderData.h);

                lastRenderedFrame = frameIndex;
            }

            function resizeCanvas() {
                const w = window.innerWidth;
                const h = window.innerHeight;

                // Optimización móvil: Si el ancho es igual y el cambio de altura es pequeño
                // (causado por la barra de direcciones), no reiniciamos el canvas.
                if (w === lastWidth && Math.abs(h - lastHeight) < 110) return;
                
                const dpr = Math.min(window.devicePixelRatio || 1, 2); // Capamos a 2 para rendimiento en Retina
                lastWidth = w; lastHeight = h;

                canvas.width = w * dpr;
                canvas.height = h * dpr;
                canvas.style.width = w + "px";
                canvas.style.height = h + "px";

                context.setTransform(dpr, 0, 0, dpr, 0, 0);

                // Pre-calculamos el escalado Full HD (Cover) para que render() sea ultra rápido
                if (images[0] && images[0].width > 0) {
                    const scale = Math.max(w / images[0].width, h / images[0].height);
                    renderData.w = images[0].width * scale;
                    renderData.h = images[0].height * scale;
                    renderData.x = (w - renderData.w) / 2;
                    renderData.y = (h - renderData.h) / 2;
                }
                render();
            }

            window.addEventListener("resize", resizeCanvas);
            resizeCanvas();

            // 1.1 ANIMACIÓN DE FRAMES Y PIN DEL HERO (Solo en sección Inicio)
            const framesTL = gsap.timeline({
                scrollTrigger: {
                    trigger: "#inicio",
                    start: "top top",
                    end: "+=200%", // Duración del efecto de scroll en el Hero
                    scrub: 1, // Reducido a 1 para que sea más responsivo al tacto en móviles
                    pin: true, // Bloqueamos la sección para que pasen los frames
                    anticipatePin: 1, // Ayuda a evitar el salto al iniciar el fijado en iOS
                    invalidateOnRefresh: true,
                    refreshPriority: 1
                }
            });

            framesTL.to(sequence, {
                frame: Math.max(0, frameCount - 1),
                snap: "frame",
                ease: "none",
                onUpdate: render,
                duration: 10
            }, 0);

            framesTL.to(canvas, {
                scale: 1.05, // Zoom más sutil
                ease: "none",
                duration: 10
            }, 0);

            // Desvanecimiento del contenido (Texto) sincronizado con el final de los frames
            framesTL.to(".hero-content", {
                opacity: 0,
                y: -80,
                duration: 3,
                ease: "power2.in"
            }, 7); // Empieza a desaparecer cuando la secuencia va al 70%
        }
    }

    // Ajuste de tamaño al redimensionar ventana
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 2. ANIMACIONES AL HACER SCROLL (Intersection Observer)
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Aplicar observador a títulos y tarjetas
    document.querySelectorAll('.animate-on-scroll:not(.gallery-item):not(.service-step)').forEach(el => {
        observer.observe(el);
    });

    // 13. SERVICIOS: EFECTO UNO POR UNO (Pinned Stacking)
    const serviceCards = gsap.utils.toArray(".service-step");
    if (serviceCards.length > 0) {
        const servicesTL = gsap.timeline({
            scrollTrigger: {
                trigger: ".services",
                start: "top top",
                end: "+=150%",
                pin: true,
                scrub: 1,
                anticipatePin: 1
            }
        });

        // Animación Premium del Título
        servicesTL.to(".services .section-title", {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out"
        }, 0);

        // Referencia al rascacielos para el efecto de desenfoque
        const skyscraper = document.getElementById('hero-canvas') || document.getElementById('canvas-container');

        if (skyscraper) {
            servicesTL.to(skyscraper, {
                filter: "blur(20px)",
                opacity: 0.3, // Reducimos opacidad para dar protagonismo a las tarjetas
                duration: 1.5,
                ease: "power2.inOut"
            }, 0); // Ocurre al mismo tiempo que entra la primera tarjeta
        }

        // Animación Horizontal Premium: Revelado escalonado (Stagger)
        servicesTL.to(serviceCards, {
            opacity: 1,
            y: 0,
            stagger: 0.3,
            duration: 1.5,
            ease: "power4.out",
            onStart: () => serviceCards.forEach(c => c.style.pointerEvents = "auto")
        }, 0.2);
    }

    // 14. GALERÍA: EFECTO CARRUSEL HORIZONTAL (Estilo Reseñas)
    const galTrack = document.querySelector('.gallery-track');
    if (galTrack) {
        const galItems = gsap.utils.toArray(".gallery-item");
        // Clonamos para asegurar el loop visual infinito
        galItems.forEach(item => {
            const clone = item.cloneNode(true);
            galTrack.appendChild(clone);
        });

        gsap.to(galTrack, {
            x: () => -(galTrack.scrollWidth / 2),
            ease: "none",
            scrollTrigger: {
                trigger: ".gallery",
                start: "top top",
                end: () => "+=" + (galTrack.scrollWidth * 0.5),
                pin: true,
                scrub: 1.5,
                invalidateOnRefresh: true
            }
        });
    }

    // 3. CAMBIO DE HEADER AL HACER SCROLL
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. SISTEMA DE TELETRANSPORTE GLOBAL (SALTO INSTANTÁNEO)
    // Elimina el recorrido visual por toda la página en cualquier sección
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = targetId === '#inicio' ? null : document.querySelector(targetId);

            if (targetId !== '#inicio' && !targetElement) return;

            const loader = document.querySelector('.loader-wrapper');
            const loaderContent = loader.querySelectorAll('.loader, .loader-text');
            loaderContent.forEach(el => el.style.visibility = 'hidden');

            gsap.to(loader, {
                opacity: 1,
                duration: 0.3,
                pointerEvents: "all",
                ease: "power2.in",
                onComplete: () => {
                    if (targetId === '#inicio') {
                        window.scrollTo(0, 0);
                    } else {
                        const offset = 70;
                        const top = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                        window.scrollTo(0, top);
                    }
                    
                    ScrollTrigger.refresh();

                    gsap.to(loader, { 
                        opacity: 0, 
                        duration: 0.5, 
                        pointerEvents: "none", 
                        delay: 0.2, 
                        ease: "power2.out",
                        onComplete: () => {
                            loaderContent.forEach(el => el.style.visibility = 'visible');
                        }
                    });
                }
            });
        });
    });

    // 5. MENU MOBILE
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
        });
    }

    // Cerrar el menú al hacer clic en cualquier parte fuera de él
    document.addEventListener('click', (e) => {
        if (navLinks && navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Cerrar al hacer clic en un enlace de sección
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // 6. CONTROL DE RESEÑAS POR SCROLL (HORIZONTAL INFINITO SEAMLESS)
    const track = document.querySelector('.reviews-track');
    const originalCards = document.querySelectorAll('.review-card');

    if (track && originalCards.length > 1) {
        // Clonamos las tarjetas para crear el loop infinito (seamless)
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });

        gsap.to(track, {
            // Nos movemos exactamente el ancho del set original
            x: () => -(track.scrollWidth / 2),
            ease: "none",
            scrollTrigger: {
                trigger: "#reseñas",
                start: "top top",
                end: () => "+=" + (originalCards.length * window.innerWidth),
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });
    }

    // 7.1 PROTECCIÓN DE BOTÓN FLOTANTE (Ofuscación de enlace)
    const floatingTrigger = document.getElementById('wa-floating-trigger');
    if (floatingTrigger) {
        floatingTrigger.addEventListener('click', () => {
            window.open(`https://wa.me/34664864946`, '_blank');
        });
    }

    // 7. GESTIÓN DE RESERVAS VÍA WHATSAPP
    const resForm = document.getElementById('reserva-form');
    if (resForm) {
        resForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const honey = document.getElementById('wa-hp').value;
            const verified = document.getElementById('wa-confirm').checked;
            if (honey || !verified) return;

            const nombre = document.getElementById('nombre-res').value;
            const fecha = document.getElementById('fecha-res').value;
            const mensaje = document.getElementById('mensaje-res').value;

            const texto = `Hola! Me gustaría realizar una reserva.\n\n👤 Nombre: ${nombre}\n📅 Fecha/Hora: ${fecha}\n📝 Notas: ${mensaje}`;
            const encodedText = encodeURIComponent(texto);
            const whatsappUrl = `https://wa.me/34664864946?text=${encodedText}`;

            window.open(whatsappUrl, '_blank');
        });
    }

    // 10. LÓGICA DE CURSOR PERSONALIZADO (PREMIUM)
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    // Solo inicializar si el dispositivo tiene puntero fino (mouse)
    if (dot && outline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0 });
            gsap.to(outline, { x: e.clientX, y: e.clientY, duration: 0.15 });
        });

        const interactives = document.querySelectorAll('a, button, .service-card, .hero-content h1, .whatsapp-float, .gallery-item');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    } else {
        // Ocultar si es móvil
        if (dot) dot.style.display = 'none';
        if (outline) outline.style.display = 'none';
    }

    // 10.1 MICRO-INTERACCIONES CON ANIME.JS (REALISMO Y MODERNIDAD)
    // Animación Premium para los iconos de servicios
    document.querySelectorAll('.service-card').forEach(card => {
        const icon = card.querySelector('i');

        // Animación de levitación constante (Idle)
        anime({
            targets: icon,
            translateY: [-2, 2],
            duration: 2000 + Math.random() * 1000,
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutQuad'
        });

        card.addEventListener('mouseenter', () => {
            anime({
                targets: icon,
                translateY: -12,
                scale: 1.15,
                filter: ['drop-shadow(0 0 0px var(--gold))', 'drop-shadow(0 0 20px var(--gold))'],
                duration: 600,
                easing: 'spring(1, 90, 15, 0)' // Más rígido, más premium
            });
        });

        card.addEventListener('mouseleave', () => {
            anime({
                targets: icon,
                translateY: 0,
                scale: 1,
                filter: 'drop-shadow(0 0 0px var(--gold))',
                duration: 800,
                easing: 'spring(1, 80, 20, 0)'
            });
        });
    });

    // 11. SECUENCIA DE CARGA Y REVELACIÓN (GSAP)
    // Nueva lógica de carga: Espera a los recursos Y al primer frame de la secuencia
    const startExperience = () => {
        if (useCanvasSequence && !firstFrameLoaded) return;
        if (window.experienceStarted) return;

        window.experienceStarted = true;

        // Carga Asíncrona de Video
        const video = document.getElementById('hero-video');
        const videoUrl = "NONE";
        if (video && videoUrl !== "NONE") {
            const source = document.createElement('source');
            source.src = videoUrl;
            source.type = 'video/mp4';
            video.appendChild(source);
            video.load();
            video.onloadeddata = () => { video.style.opacity = "1"; };

            // Optimización: Detener el video cuando no es visible para ahorrar recursos
            ScrollTrigger.create({
                trigger: "#inicio",
                onToggle: self => self.isActive ? video.play() : video.pause()
            });
        }

        const tl = gsap.timeline();

        tl.to(".loader-wrapper", {
            duration: 0.8,
            opacity: 0,
            pointerEvents: "none",
            ease: "power2.inOut"
        })
            .to(".hero-content", {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "expo.out",
                clearProps: "all" // Asegura que el scrollTrigger tome el control después
            }, "-=0.4")
            .from(".reveal-text", {
                duration: 1.4,
                y: 80,
                skewY: 7,
                opacity: 0,
                stagger: 0.2,
                ease: "expo.out"
            }, "-=0.3");
    };

    window.addEventListener('load', startExperience);
    window.addEventListener('framesReady', startExperience);

    // Temporizador de seguridad
    setTimeout(() => {
        if (!window.experienceStarted) {
            console.log("Forzando inicio de experiencia (timeout)");
            firstFrameLoaded = true;
            startExperience();
        }
    }, 4000);


    // 12. REVELACIÓN PREMIUM DE GALERÍA (GSAP Batch)
    gsap.set(".gallery-item", {
        opacity: 0,
        y: 60,
        clipPath: "inset(100% 0 0 0)"
    });

    ScrollTrigger.batch(".gallery-item", {
        onEnter: batch => gsap.to(batch, {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 1.2,
            ease: "power4.out",
            stagger: 0.15
        }),
        start: "top 90%"
    });

    // 9. TRANSICIÓN DE FONDO DINÁMICA SEGÚN SECCIÓN
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.body.setAttribute('data-active-section', entry.target.id);
            }
        });
    }, { threshold: 0.4 }); // Cambia el fondo cuando la sección ocupa el 40% de la pantalla

    document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
    });

    animate(); // Iniciar el bucle de animación después de que el DOM esté cargado (asegúrate de que esta línea esté al final del DOMContentLoaded)
});