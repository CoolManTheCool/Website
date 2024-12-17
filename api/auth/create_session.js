const bcrypt = require('bcrypt');

const fs = require('fs');
const path = require('path');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json'), 'utf8'));

// Example API module
exports.main = (queryParams) => {
    return new Promise((resolve, reject) => {
        const password = queryParams.get('password');
        const username = queryParams.get('username');
        const SSE = queryParams.get('SSE');
        const usernameRegex = /^[a-zA-Z0-9_]{5,20}$/;

        if (!password) {
            return reject({ message: 'Password is Required.', status: 401 });
        }

        if (!username || !usernameRegex.test(username)) {
            return reject({ message: 'Username is invalid or not present..', status: 422 });
        }

        var cachePath = path.join(config.CACHE_DIR, "sessions", username + ".json");
        console.log(cachePath)

        if (fs.existsSync(cachePath)) {
            return reject({ message: 'Account already exists!', status: 409 });
        }

        const userData = {
            "username": username,
            "password_hash": bcrypt.hashSync(password, 10),
            "super_secret_information": SSE,
            "date": new Date().toISOString()
        };

        fs.promises.mkdir(path.dirname(cachePath), { recursive: true });

        fs.promises.writeFile(cachePath, JSON.stringify(userData, null, 2), 'utf8');

        // Execute the protected functionality
        resolve({
            message: 'Account created!',
            data: {
                secret: SSE,
            },
        });
    });
};
