const bcrypt = require('bcrypt');

const fs = require('fs');
const path = require('path');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../config.json'), 'utf8'));

// Example API module
exports.main = (queryParams) => {
    return new Promise((resolve, reject) => {
        const password = queryParams.get('password'); // Extract password from query params

        if (!password) {
            return reject({ message: 'Unauthorized: Missing password', status: 401 });
        }

        const isMatch = bcrypt.compareSync(password, config.PASSWORD_HASH);
        if (!isMatch) {
            return reject({ message: 'Unauthorized: Invalid password', status: 401 });
        }

        // Execute the protected functionality
        resolve({
            message: 'Access granted',
            data: {
                secret: 'This is protected content.',
            },
        });
    });
};
