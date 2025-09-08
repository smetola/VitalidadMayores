document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation
            const requiredFields = document.querySelectorAll('.required');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }
            
            // Here you would typically send the form data using AJAX
            // For now, just show a success message
            alert('¡Formulario enviado correctamente! Te contactaremos en breve.');
            contactForm.reset();
        });
    }
});