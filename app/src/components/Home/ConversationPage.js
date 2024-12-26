import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { fetchConversation } from '../../api/api';
import { UserContext } from '../../context/UserContext';

const API_URL = "http://localhost:8080/";

const sendMessage = async (token, message) => {
    try {
        const response = await fetch(`${API_URL}messages/send`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to send message');
        return data;
    } catch (error) {
        throw new Error('Failed to send message: ' + error.message);
    }
};

const Conversation = ({ route }) => {
    const { params: { user1Email, user2Email } = {} } = route?.params || {};
    const { user } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const loadConversation = async () => {
            try {
                const data = await fetchConversation(user.token, user1Email, user2Email);
                setMessages(data);
            } catch (err) {
                console.error('Failed to load conversation:', err);
            }
        };
        loadConversation();
        const interval = setInterval(loadConversation, 5000);
        return () => clearInterval(interval);
    }, [user.token, user1Email, user2Email]);

    const handleSend = async () => {
        if (!newMessage.trim() || sending) return;
        setSending(true);
        try {
            const messageData = {
                senderEmail: user.email,
                receiverEmail: user.email === user1Email ? user2Email : user1Email,
                content: newMessage.trim(),
                timestamp: new Date().toISOString()
            };
            await sendMessage(user.token, messageData);
            setMessages(prev => [...prev, messageData]);
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
        } finally {
            setSending(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageContainer,
                        item.senderEmail === user.email ? styles.sentMessage : styles.receivedMessage
                    ]}>
                        <Text style={styles.sender}>{item.senderEmail}</Text>
                        <Text style={styles.message}>{item.content}</Text>
                        <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    multiline
                />
                <TouchableOpacity 
                    style={styles.sendButton} 
                    onPress={handleSend}
                    disabled={!newMessage.trim() || sending}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    messageContainer: {
        padding: 8,
        borderRadius: 8,
        marginBottom: 8,
        maxWidth: '80%',
    },
    sentMessage: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end',
    },
    receivedMessage: {
        backgroundColor: 'white',
        alignSelf: 'flex-start',
    },
    sender: {
        fontSize: 12,
        color: '#666',
    },
    message: {
        fontSize: 16,
        marginVertical: 4,
    },
    timestamp: {
        fontSize: 10,
        color: '#666',
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    input: {
        flex: 1,
        marginRight: 8,
        padding: 8,
        backgroundColor: '#f8f8f8',
        borderRadius: 16,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#2196F3',
        padding: 8,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
    }
});

export default Conversation;