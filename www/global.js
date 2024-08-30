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
if (false) {
    document.addEventListener('DOMContentLoaded', () => {
        const refreshInterval = 5000; // 1 second
    
        setInterval(() => {
            window.location.reload();
        }, refreshInterval);
    });
}

