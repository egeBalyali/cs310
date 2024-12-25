const API_URL = "http://192.168.56.1:8080/";

export const fetchFriends = async (email, token) => {
    const response = await fetch(`${API_URL}friends?email=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
};

export const fetchPendingRequests = async (email, token) => {
    const response = await fetch(`${API_URL}friends/pending?receiverEmail=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
};

export const acceptRequest = async (senderEmail, receiverEmail, token) => {
    const response = await fetch(`${API_URL}friends/accept`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senderEmail, receiverEmail }),
    });
    if (!response.ok) throw new Error('Failed to accept request');
};
export const addFriend = async (senderEmail, receiverEmail, token) => {
    try {
      const response = await fetch(`${API_URL}friends/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senderEmail, receiverEmail }),
      });
  
      if (response.ok) {
        return 'Friend added successfully';
      } else {
        throw new Error('Error adding friend');
      }
    } catch (error) {
      throw new Error('Network error');
    }
  };
  
  export const registerUser = async (email, password) => {
    try {
        const response = await fetch(API_URL + 'register', { // Assuming API endpoint is 'register'
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, message: data.message || 'Registration failed.' };
        }
    } catch (err) {
        return { success: false, message: 'Network error' };
    }
};