import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { UserContext } from '../../context/UserContext';
import { createGroup } from '../../api/api';

const CreateGroupScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreate = async () => {
    if (!groupName.trim()) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const groupData = {
        name: groupName.trim(),
        creatorEmail: user.email,
        members: [user.email]
      };
      const groupId = await createGroup(user.token, groupData);
      setSuccess('Group created successfully!');
      setTimeout(() => {
        navigation.replace('GroupDetail', { groupId });
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Group Name"
        editable={!loading}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {success && <Text style={styles.success}>{success}</Text>}
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleCreate}
        disabled={loading || !groupName.trim()}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Create Group</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default CreateGroupScreen;