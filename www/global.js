// /www/banner.js
document.addEventListener('DOMContentLoaded', () => {
    fetch('/banner.html', {
        headers: { 'x-partial': 'true' }
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('banner-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading banner:', error));
});
// /www/footer.js
document.addEventListener('DOMContentLoaded', () => {
    fetch('/footer.html', {
        headers: { 'x-partial': 'true' }
    })
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});
if (true) {
    document.addEventListener('DOMContentLoaded', () => {
        const refreshInterval = 2000;
    
        setInterval(() => {
            window.location.reload();
        }, refreshInterval);
    });
}

