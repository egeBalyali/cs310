import React from 'react';
import { FlatList, Text, View, Button, StyleSheet } from 'react-native';

const ConversationFriend = ({ friends, onAccept, onViewConversation, userEmail }) => (
    <FlatList
        data={friends}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
            <View style={styles.card}>
                <Text style={styles.text}>
                    Friend: {item.senderEmail == userEmail ? item.receiverEmail : item.senderEmail} (Accepted: {item.accepted ? 'Yes' : 'No'})
                </Text>
                <View style={styles.buttonGroup}>
                    {onAccept && (
                        <Button title="Accept" onPress={() => onAccept(item.senderEmail == userEmail ? item.receiverEmail : item.senderEmail)} color="#4CAF50" />
                    )}
                    <Button
                        title="Go to Conversation"
                        onPress={() => onViewConversation(item.senderEmail == userEmail ? item.receiverEmail : item.senderEmail)}
                        color="#2196F3"
                    />
                </View>
            </View>
        )}
    />
);

const styles = StyleSheet.create({
    card: { padding: 15, marginVertical: 5, backgroundColor: '#f9f9f9', borderRadius: 5 },
    text: { fontSize: 16 },
    buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});

export default ConversationFriend;