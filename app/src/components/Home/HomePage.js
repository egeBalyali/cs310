import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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

    const NavigationButton = ({ title, onPress }) => (
        <TouchableOpacity 
            style={styles.navigationButton} 
            onPress={onPress}
        >
            <Text style={styles.navigationButtonText}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.navigationSection}>
                <NavigationButton 
                    title="Pending Requests" 
                    onPress={() => navigation.navigate('PendingRequests')} 
                />
                <NavigationButton 
                    title="Add New Friend" 
                    onPress={() => navigation.navigate('AddFriendship')} 
                />
                <NavigationButton 
                    title="Groups" 
                    onPress={() => navigation.navigate('GroupList')} 
                />
            </View>

            <View style={styles.contentSection}>
                <Text style={styles.sectionTitle}>Friends</Text>
                {error ? (
                    <ErrorMessage message={error} />
                ) : (
                    <View style={styles.friendsContainer}>
                        <ConversationFriend 
                            friends={friends} 
                            userEmail={user.email} 
                            onViewConversation={handleViewConversation} 
                        />
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    navigationSection: {
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        margin: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    contentSection: {
        flex: 1,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    navigationButton: {
        backgroundColor: '#2196F3',
        padding: 14,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    navigationButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    friendsContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
});

export default HomePage;