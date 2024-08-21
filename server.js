const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Create the server
const server = http.createServer((req, res) => {
    // Set the file path to index.html
    const filePath = path.join(__dirname, 'index.html');

    // Read the HTML file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Server Error');
        } else {
            // Serve the HTML content
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        }
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
