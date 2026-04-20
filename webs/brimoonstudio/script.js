// Manejo del Menú Móvil
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Lógica del Formulario de Reserva con Enfoque Mirada & Manos
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;

    // Configuración WhatsApp
    const phone = "34643996431";
    const message = `¡Hola BRIMOON.studio! ✨%0A%0AQuisiera reservar una cita para lucir radiante:%0A👤 *Nombre:* ${name}%0A💖 *Tratamiento:* ${service}%0A📅 *Fecha:* ${date}%0A%0A¿Podríais confirmarme disponibilidad? Gracias.`;

    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
});

// Scroll Suave con Ajuste de Header
document.querySelectorAll('.nav-links a, .hero-btns a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);
            
            navLinks.classList.remove('active'); // Cerrar menú móvil

            window.scrollTo({
                top: targetSection.offsetTop - 85,
                behavior: 'smooth'
            });
        }
    });
});

// Efecto de Scroll en Navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 80) {
        navbar.style.padding = "15px 8%";
        navbar.style.background = "#fff";
    } else {
        navbar.style.padding = "25px 8%";
    }
});