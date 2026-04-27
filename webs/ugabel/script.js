window.addEventListener('DOMContentLoaded', () => {
// 0. INICIALIZACIÓN DE PLUGINS
gsap.registerPlugin(ScrollTrigger);

// 1. BACKGROUND 3D CON THREE.JS
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

const container = document.getElementById('canvas-container');
const hasVideo = "Talleres.mp4" !== "NONE";

if (container) {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a1a, hasVideo ? 0 : 1); // Transparente si hay video
    // Asegurar que el canvas no bloquee el scroll táctil
    renderer.domElement.style.touchAction = 'none';
    container.appendChild(renderer.domElement);
}

// 1.1 OBJETO 3D ORIGINAL (Nudo Elegante)
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
if (geometry && !hasVideo) {
    // Sistema de Partículas Global para fondos sin video
    const material = new THREE.PointsMaterial({ 
        size: 0.08, 
        color: 0x0076ff, 
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

// Interacción 3D con el Mouse
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) / 40; // Rango más amplio de movimiento
    mouseY = (e.clientY - window.innerHeight / 2) / 40;
});

function animate() {
    requestAnimationFrame(animate);

    if (window.bannerObject) {
        const time = Date.now() * 0.001;
        window.bannerObject.rotation.x += 0.005;
        window.bannerObject.rotation.y += 0.005;
        window.bannerObject.rotation.z += 0.002;
        
        // Efecto de flotación orgánica (Impacto Premium)
        window.bannerObject.position.x += (mouseX + Math.cos(time * 0.5) * 5 - window.bannerObject.position.x) * 0.03;
        window.bannerObject.position.y += (-mouseY + Math.sin(time * 0.5) * 4 - window.bannerObject.position.y) * 0.03;
    }

    // 8. EFECTO PARALLAX EN GALERÍA
    document.querySelectorAll('.gallery-item').forEach(item => {
        const rect = item.getBoundingClientRect();
        const img = item.querySelector('img');
        if (rect.top < window.innerHeight && rect.bottom > 0 && img) {
            const shift = (rect.top - window.innerHeight / 2) * 0.15; // Velocidad del efecto
            img.style.transform = `translateY(${shift}px) scale(1.05)`;
        }
    });
    
    renderer.render(scene, camera);
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
document.querySelectorAll('.section-title, .service-card, .animate-on-scroll:not(.gallery-item)').forEach(el => {
    observer.observe(el);
});

// 3. CAMBIO DE HEADER AL HACER SCROLL
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
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

// 6. CARRUSEL DE RESEÑAS AUTOMÁTICO
const track = document.querySelector('.reviews-track');
const reviews = document.querySelectorAll('.review-card');

if (track && reviews.length > 0) {
    let index = 0;
    const totalReviews = reviews.length;

    function nextReview() {
        index = (index + 1) % totalReviews;
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    // Iniciar con un pequeño retraso para asegurar que la carga visual sea fluida
    let carouselInterval = setInterval(nextReview, 6000);

    track.addEventListener('mouseenter', () => clearInterval(carouselInterval));
    track.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(nextReview, 6000);
    });
}

// 7. GESTIÓN DE RESERVAS VÍA WHATSAPP
const resForm = document.getElementById('reserva-form');
if (resForm) {
    resForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre-res').value;
        const fecha = document.getElementById('fecha-res').value;
        const mensaje = document.getElementById('mensaje-res').value;
        
        const texto = `Hola! Me gustaría realizar una reserva.\n\n👤 Nombre: ${nombre}\n📅 Fecha/Hora: ${fecha}\n📝 Notas: ${mensaje}`;
        const encodedText = encodeURIComponent(texto);
        const whatsappUrl = `https://wa.me/34616817407?text=${encodedText}`;
        
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
    if(dot) dot.style.display = 'none';
    if(outline) outline.style.display = 'none';
}

// 11. SECUENCIA DE CARGA Y REVELACIÓN (GSAP)
window.addEventListener('load', () => {
    // Carga Asíncrona de Video
    const video = document.getElementById('hero-video');
    const videoUrl = "Talleres.mp4";
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
    .from(".reveal-text", {
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.15,
        ease: "power4.out"
    }, "-=0.3");
});

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