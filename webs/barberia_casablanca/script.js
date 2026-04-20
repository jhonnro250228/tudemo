// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinksContainer = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
});

// Booking Form Logic - Send to WhatsApp
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const clientName = document.getElementById('clientName').value;
    const selectedService = document.getElementById('selectedService').value;
    const bookingDate = document.getElementById('bookingDate').value;

    // Business phone number
    const phoneNumber = "34946038474";

    // Construct WhatsApp message
    const message = `¡Hola Barbería Casablanca! 💈%0A%0AMe gustaría solicitar una cita:%0A👤 *Nombre:* ${clientName}%0A✂️ *Servicio:* ${selectedService}%0A📅 *Fecha deseada:* ${bookingDate}%0A%0A¿Tenéis disponibilidad? ¡Gracias!`;

    // Open WhatsApp chat in a new tab
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('.nav-links a, .btn-primary, .btn-outline').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            // Close mobile menu if open
            navLinksContainer.classList.remove('active');

            window.scrollTo({
                top: targetSection.offsetTop - 80, // Adjust for fixed navbar height
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});