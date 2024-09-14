module.exports.main = function() {
    return new Promise((resolve, reject) => {
        // Replace the following object with your arbitrary test JSON data
        const testJson = {
            "total_users": 123,
            "active_users" : 25,
            "date": new Date().toISOString()
        };

        resolve(testJson);
    });
};
