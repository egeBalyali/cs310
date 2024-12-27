const API_URL = "http://10.0.2.2:8080/"

export const loginUser = async (email, password) => {
    const url = API_URL + "login";  // Adjust the API URL accordingly
    const requestBody = {
      email,
      password
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
  
      // Check if the response status is OK (status code 200)
      if (response.ok) {
        const data = await response.json();  // Parse the JSON response
        const { statusCode, message, data: token } = data;  // Destructure response
  
        console.log('Status Code:', statusCode);
        console.log('Message:', message);
        console.log('Token:', token);
  
        // You can then store the token in localStorage or manage it using React state
      } else {
        const errorData = await response.json();
        const { statusCode, message } = errorData;
        console.error('Error:', message);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };