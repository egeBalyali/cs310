import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { UserContext } from '../../context/UserContext';
import { getGroupMessages, sendGroupMessage } from "../../api/api";




const GroupChatScreen = ({ route }) => {
  const { groupId } = route.params;
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messages = await getGroupMessages(user.token, groupId);
        setMessages(messages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    fetchMessages();
    // Set up periodic refresh if needed
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [groupId, user.token]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    const messageData = {
      content: newMessage.trim(),
      senderEmail: user.email,
      timestamp: new Date().toISOString()
    };

    try {
      await sendGroupMessage(user.token, groupId, messageData);
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
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
          disabled={!newMessage.trim()}
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
  },
});

export default GroupChatScreen;