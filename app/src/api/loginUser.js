const API_URL = "http://10.0.2.2:8080/"
export const loginUser = async (email, password) => {
    const { user } = useContext(UserContext);
    if (user.token)
    {
        return { success: true, token: user.token };
    }
    try {
        const response = await fetch('http://10.0.2.2:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        const { statusCode, message, data: token } = data;  // Destructure response
  
        console.log('Status Code:', statusCode);
        console.log('Message:', message);
        console.log('Token:', token);

        if (response.ok) {
            // Handle success, store token, or navigate user
            return { success: true, token: data.data };
        } else {
            // Handle error from API response
            return { success: false, message: data.message };
        }
    } catch (err) {
        return { success: false, message: 'An error occurred. Please try again later.' };
    }
};
