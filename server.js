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
    const scriptPath = path.join(API_DIR, req.url.replace('/api', ''), "index.js");
    const apiModule = require(scriptPath);

    if (typeof apiModule.main === 'function') {
        // Check if it's already a promise
        let result = apiModule.main();

        if (!(result instanceof Promise)) {
            // If it's not a Promise, wrap it in one
            result = Promise.resolve(result);
        }

        result
            .then(result => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            })
            .catch(err => {
                res.writeHead(err.status || 500, { 'Content-Type': 'text/plain' });
                res.end(err.message || '500 Server Error');
            });
    } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error: No main function found');
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
