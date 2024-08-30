document.addEventListener('DOMContentLoaded', function() {
    fetch('127.0.0.1:3000/api/users/') // Replace with your API endpoint
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error('Error fetching users:', error));
});

async function fetchData() {
    try {
        const response = await fetch('http://127.0.0.1:3000/api/users');
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        // Extract the relevant fields from the JSON response
        const totalVisits = data.total_users;
        const currentlyOnline = data.active_users;
        const lastUpdated = new Date(data.date).toLocaleString(); // Format the date
        
        // Create a formatted string with the extracted data
        const outputText = `Total Visits: ${totalVisits}\nCurrently Online: ${currentlyOnline}\nLast Updated: ${lastUpdated}`;
        
        // Display the output in the <pre> element
        document.getElementById('output').textContent = outputText;
    } catch (error) {
        document.getElementById('output').textContent = 'Error: ' + error.message;
    }
}


// Call fetchData on page load
fetchData();
/*
{
  "total_users": 123,
  "active_users": 25,
  "date": "2024-08-26T00:51:10.859Z"
}
*/