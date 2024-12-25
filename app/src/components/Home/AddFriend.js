import React, { useState,useContext } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { addFriend } from '../../api/api';
import { UserContext } from '../../context/UserContext';
export const AddFriendship = () => {
    const { user } = useContext(UserContext);
  const [email, setEmail] = useState('');

  const handleAddFriend = async () => {
    if (!email) {
      Alert.alert('Please enter an email');
      return;
    }

    try {
      const message = await addFriend(user.email, email, user.token);
      Alert.alert(message);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter friend's email"
        value={email}
        onChangeText={setEmail}
        style={{ borderBottomWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title="Add Friend" onPress={handleAddFriend} />
    </View>
  );
};

