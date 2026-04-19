// Lógica para Peluquería Masculina Marta

// 1. Manejo del formulario de reserva vía WhatsApp
document.getElementById('reservaForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Detener envío normal

    // Obtener valores
    const nombre = document.getElementById('userName').value;
    const servicio = document.getElementById('userServicio').value;
    const fecha = document.getElementById('userFecha').value;

    // Teléfono de contacto (Prefijo 34 + 944125160)
    const tlf = "34944125160";

    // Estructurar el mensaje
    const texto = `¡Hola Marta! 👋%0A%0AQuisiera solicitar una cita en tu peluquería:%0A%0A👤 *Nombre:* ${nombre}%0A✂️ *Servicio:* ${servicio}%0A📅 *Fecha:* ${fecha}%0A%0A¿Me podrías confirmar si tienes hueco?`;

    // Abrir WhatsApp
    const url = `https://wa.me/${tlf}?text=${texto}`;
    window.open(url, '_blank');
});

// 2. Scroll suave para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Compensación por navbar fija
                behavior: 'smooth'
            });
        }
    });
});