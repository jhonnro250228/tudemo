// Animación de Scroll Suave para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === "#") return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // El scroll-behavior: smooth en CSS se encarga del resto
        }
    });
});

// Lógica para enviar reserva por WhatsApp
document.getElementById('reserva-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const servicio = document.getElementById('servicio-select').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    
    const telefono = "34688845356"; // Formato internacional
    
    const mensaje = `Hola Salón Origen! Me gustaría reservar una cita:
👤 Nombre: ${nombre}
💇‍♂️ Servicio: ${servicio}
📅 Fecha: ${fecha}
⏰ Hora: ${hora}

¿Tenéis disponibilidad?`;

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(url, '_blank');
});

// Menú Móvil Básico
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if(menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});