document.addEventListener('DOMContentLoaded', () => {
    // Animaciones AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Menú Hamburguesa
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // Cambiar icono
        const icon = mobileMenu.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
});