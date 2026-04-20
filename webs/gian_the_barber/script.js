// Menú Móvil
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Lógica de Reserva WhatsApp
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('clientName').value;
    const service = document.getElementById('selectedService').value;
    const date = document.getElementById('bookingDate').value;

    const phone = "34687361598";
    const message = `¡Hola Gian The Barber! 💈%0A%0AQuisiera solicitar una cita:%0A👤 *Cliente:* ${name}%0A✂️ *Servicio:* ${service}%0A📅 *Fecha:* ${date}%0A%0A¿Podrías confirmarme disponibilidad?`;

    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
});

// Scroll Suave
document.querySelectorAll('.nav-links a, .hero-btns a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(targetId);
            navLinks.classList.remove('active');
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Efecto Header Scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 100) nav.style.padding = "15px 8%";
    else nav.style.padding = "20px 8%";
});