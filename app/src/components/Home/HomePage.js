import React, { useContext, useEffect, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import FriendList from '../Shared/FriendList';
import ErrorMessage from '../Shared/ErrorMessage';
import { UserContext } from '../../context/UserContext';
import { fetchFriends } from '../../api/api';

const HomePage = ({ navigation }) => {
    const { user } = useContext(UserContext);
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadFriends = async () => {
            try {
                const friendsData = await fetchFriends(user.email, user.token);
                setFriends(friendsData);
            } catch (err) {
                setError(err.message || 'Failed to fetch friends.');
            }
        };

        loadFriends();
    }, [user]);

    return (
        <View style={styles.container}>
            <Button title="Pending Requests" onPress={() => navigation.navigate('PendingRequests')} />
            <Button title="Add New Friend" onPress={() => navigation.navigate('AddFriendship')} /> {/* Add New Friend button */}
            {error ? <ErrorMessage message={error} /> : <FriendList friends={friends} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
});

export default HomePage;
