import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { addFriend } from '../../api/api';
import { UserContext } from '../../context/UserContext';

export const AddFriendship = () => {
  const { user } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleAddFriend = async () => {
    if (!email) {
      setStatus({ type: 'error', message: 'Please enter an email' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const message = await addFriend(user.email, email, user.token);
      setStatus({ type: 'success', message });
      setEmail('');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter friend's email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        editable={!loading}
      />
      {status.message && (
        <Text style={status.type === 'error' ? styles.error : styles.success}>
          {status.message}
        </Text>
      )}
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleAddFriend}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Add Friend</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  success: {
    color: 'green',
    marginBottom: 16,
  }
});