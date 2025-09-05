// This script handles the functionality of the dependencia section

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-dependencia');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            buttons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.dependencia-content').forEach(content => {
                content.style.display = 'none';
            });
            const option = this.getAttribute('data-option');
            const content = document.getElementById('content-' + option);
            if (content) {
                content.style.display = 'block';
            }
        });
    });
});