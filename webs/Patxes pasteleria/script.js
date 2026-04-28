// Menú de navegación móvil
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

// Animación de revelación al hacer scroll
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);

// Efecto de cambio de color en Navbar al hacer scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        navbar.style.padding = '0.8rem 5%';
    } else {
        navbar.style.boxShadow = 'none';
        navbar.style.padding = '1.2rem 5%';
    }
});

// Gestión de Reservas por WhatsApp
const form = document.getElementById('reserva-form');
if(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = form.querySelector('input[type="text"]').value;
        const tipo = form.querySelector('select').value;
        const detalles = form.querySelector('textarea').value;
        
        const telefono = "34747428103";
        const mensaje = `Hola Patxes Pastelería!%0AQuiero realizar una reserva:%0A*Nombre:* ${nombre}%0A*Servicio:* ${tipo}%0A*Notas:* ${detalles}`;
        
        window.open(`https://wa.me/${telefono}?text=${mensaje}`, '_blank');
        
        form.reset();
    });
}

// Inicializar funciones
reveal();
navSlide();