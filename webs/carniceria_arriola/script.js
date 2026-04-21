// Manejo del Formulario de Reserva/Pedido por WhatsApp
document.getElementById('reserva-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const servicio = document.getElementById('servicio-select').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const detalles = document.getElementById('detalles').value;
    
    const telefono = "34747414358";
    
    const mensaje = `Hola Carnicería Arriola! Me gustaría realizar un pedido:
🥩 Tipo: ${servicio}
👤 Cliente: ${nombre}
📅 Recogida: ${fecha} a las ${hora}
📝 Detalles: ${detalles ? detalles : 'Sin detalles adicionales'}

¿Podéis confirmarme que habéis recibido el pedido?`;

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
});

// Menú Móvil Desplegable Centrado
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if(menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Cerrar menú automáticamente al navegar (Smooth Scroll)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});