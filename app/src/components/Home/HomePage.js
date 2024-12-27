import React, { useContext, useEffect, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import ConversationFriend from '../Shared/ConversationFriend';
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
                console.log(friendsData);
                setFriends(friendsData);
            } catch (err) {
                setError(err.message || 'Failed to fetch friends.');
            }
        };

        loadFriends();
    }, [user]);

    const handleViewConversation = (friendEmail) => {
        navigation.navigate('Conversation', {
            screen: 'Conversation',
            params: { user1Email: user.email, user2Email: friendEmail }
        });
    };
    return (
        <View style={styles.container}>
            <Button title="Pending Requests" onPress={() => navigation.navigate('PendingRequests')} />
            <Button title="Add New Friend" onPress={() => navigation.navigate('AddFriendship')} />
            {error ? (
                <ErrorMessage message={error} />
            ) : (
                <ConversationFriend friends={friends} userEmail={user.email} onViewConversation={handleViewConversation} />
            )}
            <Button title='Groups' onPress={() =>navigation.navigate('GroupList') } />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
});

export default HomePage;
