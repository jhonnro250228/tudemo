// 1. BACKGROUND 3D CON THREE.JS
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

const container = document.getElementById('canvas-container');
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Objeto 3D - Un Toroide (Dona) elegante que parece una joya/accesorio
const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
const material = new THREE.MeshPhongMaterial({ 
    color: 0xc5a059, 
    shininess: 100,
    wireframe: true 
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Luces
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 20);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

camera.position.z = 30;

// Interacción 3D con el Mouse
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) / 100;
    mouseY = (e.clientY - window.innerHeight / 2) / 100;
});

function animate() {
    requestAnimationFrame(animate);
    torusKnot.rotation.x += 0.005;
    torusKnot.rotation.y += 0.005;
    
    // Suavizado de movimiento con mouse
    torusKnot.position.x += (mouseX - torusKnot.position.x) * 0.05;
    torusKnot.position.y += (-mouseY - torusKnot.position.y) * 0.05;
    
    renderer.render(scene, camera);
}
animate();

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
document.querySelectorAll('.section-title, .service-card, .animate-on-scroll').forEach(el => {
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
document.getElementById('mobile-menu').addEventListener('click', () => {
    const nav = document.querySelector('.nav-links');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});