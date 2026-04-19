// Lógica de reserva vía WhatsApp
document.getElementById('whatsappForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    
    const businessPhone = "34637303460";
    const message = `¡Hola XDonBarber! 👋%0AQuiero solicitar una cita:%0A%0A👤 *Nombre:* ${name}%0A✂️ *Servicio:* ${service}%0A📅 *Fecha:* ${date}%0A🕒 *Hora:* ${time}%0A%0A¿Tienen disponibilidad?`;
    
    const whatsappUrl = `https://wa.me/${businessPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
});

// Lógica del Menú Móvil
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace (para móvil)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Animaciones de entrada al hacer scroll (Intersection Observer)
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Smooth Scroll para la navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
    });
});