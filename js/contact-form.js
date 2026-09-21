document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Anti-bot: registrar timestamp de carga del formulario
        const formLoadTime = Date.now();

        contactForm.addEventListener('submit', function(e) {
            // Anti-bot: rechazar envíos demasiado rápidos (bots < 3 segundos)
            const elapsedSeconds = (Date.now() - formLoadTime) / 1000;
            if (elapsedSeconds < 3) {
                e.preventDefault();
                return; // Silencioso — no dar pistas al bot
            }

            // Validation
            const requiredFields = document.querySelectorAll('.required');
            let isValid = true;
            
            // Remove previous error states
            requiredFields.forEach(field => {
                field.classList.remove('error');
            });
            
            // Validate required fields
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                }
            });
            
            // Validate email format
            const emailField = document.getElementById('email');
            if (emailField.value.trim() && !isValidEmail(emailField.value.trim())) {
                isValid = false;
                emailField.classList.add('error');
                alert('Por favor, introduce un email válido.');
                e.preventDefault();
                return;
            }
            
            // Validate phone format (basic Spanish phone validation)
            const phoneField = document.getElementById('telefono');
            if (phoneField.value.trim() && !isValidPhone(phoneField.value.trim())) {
                isValid = false;
                phoneField.classList.add('error');
                alert('Por favor, introduce un teléfono válido.');
                e.preventDefault();
                return;
            }
            
            if (!isValid) {
                alert('Por favor, completa todos los campos obligatorios marcados con *.');
                e.preventDefault();
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('.btn-form');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>Enviando...</span>';
            submitButton.disabled = true;
            
            // Form will be submitted normally to FormSubmit
            // No need to prevent default if validation passes
        });
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation function (SOLO teléfonos españoles)
function isValidPhone(phone) {
    // Remove spaces, dashes, and parentheses
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    // Rechazar explícitamente prefijos internacionales que no sean +34
    if (cleanPhone.startsWith('+') && !cleanPhone.startsWith('+34')) {
        return false;
    }
    // Solo teléfonos españoles: 9 dígitos empezando por 6, 7, 8 o 9, con o sin +34
    const phoneRegex = /^(\+34)?[6789]\d{8}$/;
    return phoneRegex.test(cleanPhone);
}
