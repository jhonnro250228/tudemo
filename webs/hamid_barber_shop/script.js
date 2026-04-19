// Gestión del formulario de reserva por WhatsApp
document.getElementById('whatsappForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita la recarga de la página

    // Obtención de datos del formulario
    const name = document.getElementById('name').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;

    // Teléfono de Hamid barber shop (con prefijo de España 34)
    const phone = "34663402811";

    // Creación del mensaje personalizado
    const message = `¡Hola Hamid barber shop! 💈%0A%0AQuisiera reservar una cita:%0A👤 *Nombre:* ${name}%0A✂️ *Servicio:* ${service}%0A📅 *Fecha:* ${date}%0A%0A¿Tenéis hueco disponible?`;

    // Generación del enlace de WhatsApp
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

    // Abrir en nueva pestaña
    window.open(whatsappUrl, '_blank');
});

// Efecto de navegación suave (Smooth Scroll)
document.querySelectorAll('.nav-links a, .hero-btns a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80, // Offset por la navbar fija
                behavior: 'smooth'
            });
        }
    });
});