const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

// Load configuration from config.json
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

const PORT = config.PORT;
const WWW_DIR = path.resolve(config.WWW_DIR);
const API_DIR = path.resolve(config.API_DIR);

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api')) {
        handleApiRequest(req, res);
    } else {
        handleFileRequest(req, res);
    }
});

function handleApiRequest(req, res) {
    if (req.method === 'GET') {
        handleGETRequest(req, res);
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('405 Method Not Allowed');
    }
}

function handleGETRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const scriptPath = path.join(API_DIR, url.pathname.toLowerCase().replace('/api', ''));

    try {
        const apiModule = require(scriptPath);

        if (typeof apiModule.main === 'function') {
            const queryParams = new URLSearchParams(url.search);
            const password = req.headers['authorization']?.split(' ')[1]; // Extract password from the header
            if (password) queryParams.set('password', password);

            Promise.resolve(apiModule.main(queryParams))
                .then((output) => {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(output));
                })
                .catch((err) => {
                    res.writeHead(err.status || 500, { 'Content-Type': 'text/plain' });
                    res.end(err.message || '500 Server Error');
                });
        } else {
            throw new Error('No main function found');
        }
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Server Error: ${err.message}`);
    }
}

function handleFileRequest(req, res) {
    let filePath = path.join(WWW_DIR, req.url === '/' ? 'index.html' : req.url);
    filePath = path.resolve(filePath);

    if (!filePath.startsWith(WWW_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        return res.end('403 Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end('404 Not Found');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('500 Server Error');
            }
        }

        if (stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.svg': 'application/image/svg+xml',
        };

        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404 Not Found');
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('500 Server Error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });
}

server.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
