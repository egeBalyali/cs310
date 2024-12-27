const API_URL = "http://10.0.2.2:8080/"

export const listFriends = async (token, email) =>
{
    try
    {
        const url = API_URL + "friends";
const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }), // Wrap the email in an object and stringify it
});

const data = await response.json();
const { statusCode, message, data: list } = data; // Assuming `data` contains an array named `list`

console.log('Status Code:', statusCode);
console.log('Message:', message);

if (response.ok) {
    if (Array.isArray(list)) {
        // Safely map over the list if it is an array
        return (
            list.map((friend, index) => <h1 key={index}>{friend.name}</h1>)
        );
    } else {
        console.error('Expected an array, but got:', list);
        return { success: false, message: 'Invalid data format' };
    }
} else {
    // Handle error from API response
    return { success: false, message: data.message };
}

    }
    catch (err)
    {
        return { success: false, message: 'An error occurred. Please try again later.' };
    }
}