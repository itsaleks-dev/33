document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('btn--ptinary');
    if (button) {
        button.addEventListener('click', () => alert('Кнопка працює!'));
    }
});