// Lógica de interacción y reserva para IL BARBIERE DI FANA

// 1. Gestión del formulario de Reserva
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Detenemos el envío estándar

    // Capturamos la información del usuario
    const name = document.getElementById('clientName').value;
    const service = document.getElementById('selectedService').value;
    const date = document.getElementById('bookingDate').value;

    // Configuración del destino (Número de la barbería)
    const phone = "34688718629";

    // Formateo del mensaje para WhatsApp
    const message = `Buongiorno! 💈%0A%0AMe gustaría solicitar una cita en *IL BARBIERE DI FANA*:%0A%0A👤 *Cliente:* ${name}%0A✂️ *Servicio:* ${service}%0A📅 *Fecha deseada:* ${date}%0A%0A¿Tenéis disponibilidad en esa fecha?`;

    // Construcción de la URL de WhatsApp y apertura de ventana
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
});

// 2. Animación de Navegación Suave (Smooth Scroll)
document.querySelectorAll('.nav-links a, .hero-actions a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Compensamos la altura de la navbar
                behavior: 'smooth'
            });
        }
    });
});