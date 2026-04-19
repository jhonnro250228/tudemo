// Listener para interceptar el envío del formulario de reserva
document.getElementById('whatsappForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue
    
    // Captura de valores de los campos del formulario
    const name = document.getElementById('name').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    
    // El número de teléfono de la barbería
    const phone = "34944158746";
    
    // Construcción del mensaje codificado para la URL de WhatsApp
    const message = `Hola Barbería isi y aitor! 👋%0AMi nombre es: ${name}%0AQuiero reservar: ${service}%0APara el día: ${date}%0A¿Tenéis disponibilidad?`;
    
    // Generación y apertura del enlace de WhatsApp
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
});

// Implementación de scroll suave (Smooth Scroll) para los enlaces de navegación interna
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Evita el salto brusco
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
