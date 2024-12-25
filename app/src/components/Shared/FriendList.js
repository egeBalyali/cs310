import React from 'react';
import { FlatList, Text, View, Button, StyleSheet } from 'react-native';

const FriendList = ({ friends, onAccept }) => (
    <FlatList
        data={friends}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
            <View style={styles.card}>
                <Text style={styles.text}>
                    Friend: {item.senderEmail} (Accepted: {item.accepted ? 'Yes' : 'No'})
                </Text>
                {onAccept && (
                    <Button title="Accept" onPress={() => onAccept(item.senderEmail)} color="#4CAF50" />
                )}
            </View>
        )}
    />
);

const styles = StyleSheet.create({
    card: { padding: 15, marginVertical: 5, backgroundColor: '#f9f9f9', borderRadius: 5 },
    text: { fontSize: 16 },
});

export default FriendList;
