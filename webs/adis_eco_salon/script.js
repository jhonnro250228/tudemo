// Lógica para el Menú Móvil
const menuToggle = document.getElementById('mobile-menu');
const navLinksContainer = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
});

// Manejo del formulario de reserva
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Captura de datos
    const name = document.getElementById('clientName').value;
    const service = document.getElementById('selectedService').value;
    const date = document.getElementById('bookingDate').value;

    // Teléfono del negocio (652 34 76 50)
    const phone = "34652347650";

    // Construcción del mensaje
    const message = `¡Hola Adis Eco Salon! 🌿%0A%0AQuisiera solicitar una cita:%0A👤 *Nombre:* ${name}%0A✂️ *Servicio:* ${service}%0A📅 *Fecha deseada:* ${date}%0A%0A¿Tenéis disponibilidad?`;

    // URL de WhatsApp
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

    // Abrir en nueva ventana
    window.open(whatsappUrl, '_blank');
});

// Scroll suave para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        navLinksContainer.classList.remove('active'); // Cerrar menú al hacer click
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animación básica de aparición al hacer scroll (opcional)
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = "10px 8%";
        navbar.style.background = "rgba(255, 255, 255, 1)";
    } else {
        navbar.style.padding = "20px 8%";
        navbar.style.background = "rgba(255, 255, 255, 0.95)";
    }
});