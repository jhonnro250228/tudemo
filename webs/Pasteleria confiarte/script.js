/* eslint-env browser */
/* global AOS */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Animaciones AOS con configuración suave
    // Usamos window.AOS para que el editor sepa que es una propiedad global del navegador
    if (typeof window.AOS !== 'undefined') {
        window.AOS.init({
            duration: 1200,
            once: true,
            offset: 150
        });
    }

    // Menú Hamburguesa para Móviles
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // Cerrar menú al hacer click en un enlace (UX móvil)
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
        });
    });
});