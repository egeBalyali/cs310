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
        return 'Friendship request sent successfully';
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


// api.js
export const fetchConversation = async (token, user1Email, user2Email) => {
    const response = await fetch(
        `${API_URL}messages?user1Email=${user1Email}&user2Email=${user2Email}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch conversation');
    }

    const data = await response.json();
    return data.data; // Adjust according to the API response structure
};
export const sendMessage = async (token, message) => {
    try {
        const response = await fetch(`${API_URL}send`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
        
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to send message');
        }
        return data;
    } catch (error) {
        throw new Error('Failed to send message: ' + error.message);
    }
};
export const handleSendMessage = async () => {
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const messageData = {
                senderEmail: user.email,
                recipientEmail: user.email === user1Email ? user2Email : user1Email,
                content: newMessage.trim(),
                timestamp: new Date().toISOString()
            };

            await sendMessage(user.token, messageData);
            
            // Optimistically add the message to the list
            setMessages(prevMessages => [...prevMessages, messageData]);
            setNewMessage('');
        } catch (err) {
            setError('Failed to send message: ' + err.message);
        } finally {
            setSending(false);
        }
    };

    // Add to your api.js file

export const createGroup = async (token, groupData) => {
    const response = await fetch(`${API_URL}groups/create`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData)
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create group');
    }
    return data.data; // Returns groupId
};

export const addGroupMember = async (token, groupId, newMemberEmail) => {
    const response = await fetch(`${API_URL}groups/${groupId}/add-member?newMemberEmail=${newMemberEmail}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to add member');
    }
    return data;
};

export const sendGroupMessage = async (token, groupId, messageData) => {
    const response = await fetch(`${API_URL}groups/${groupId}/send`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData)
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
    }
    return data;
};


const filterUniqueMessages = (data) => {
  const uniqueSet = new Set();
  const uniqueList = [];

  data.forEach((item) => {
    const uniqueKey = `${item.senderEmail}-${item.content}-${item.id.slice(0, 8)}`;
    if (!uniqueSet.has(uniqueKey)) {
      uniqueSet.add(uniqueKey);
      uniqueList.push(item);
    }
  });

  return uniqueList;
};

export const getGroupMessages = async (token, groupId) => {
    const response = await fetch(`${API_URL}groups/${groupId}/messages`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch messages');
    }
    return filterUniqueMessages(data.data);
};

export const getGroupMembers = async (token, groupId) => {
    const response = await fetch(`${API_URL}groups/${groupId}/members`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch members');
    }
    return data.data;
};
export const getGroups = async (token, email) => {
    const response = await fetch(`${API_URL}groups?email=${email}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch members');
    }
    return data.data;
}