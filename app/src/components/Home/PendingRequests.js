import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import FriendList from '../Shared/FriendList';
import ErrorMessage from '../Shared/ErrorMessage';
import { UserContext } from '../../context/UserContext';
import { fetchPendingRequests, acceptRequest } from '../../api/api';

const PendingRequests = () => {
    const { user } = useContext(UserContext);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPendingRequests = async () => {
            try {
                const requestsData = await fetchPendingRequests(user.email, user.token);
                setPendingRequests(requestsData);
            } catch (err) {
                setError(err.message || 'Failed to fetch pending requests.');
            }
        };

        loadPendingRequests();
    }, [user]);

    const handleAccept = async (senderEmail) => {
        try {
            await acceptRequest(senderEmail, user.email, user.token);
            setPendingRequests((prev) => prev.filter((req) => req.senderEmail !== senderEmail));
        } catch (err) {
            setError(err.message || 'Failed to accept request.');
        }
    };

    return (
        <View style={styles.container}>
            {error ? (
                <ErrorMessage message={error} />
            ) : (
                <FriendList friends={pendingRequests} onAccept={handleAccept} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
});

export default PendingRequests;
