import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { UserContext } from '../../context/UserContext';
import {getGroupMembers, addGroupMember} from "../../api/api";

const GroupDetailScreen = ({ route, navigation }) => {
  const { groupId } = route.params;
  const { user } = useContext(UserContext);
  const [members, setMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
        try {
            const members = await getGroupMembers(user.token, groupId);
            setMembers(members);
        } catch (error) {
            console.error('Failed to fetch members:', error);
        }
    };
    fetchMembers();
}, [groupId]);

const handleAddMember = async () => {
    try {
        await addGroupMember(user.token, groupId, newMemberEmail);
        const updatedMembers = await getGroupMembers(user.token, groupId);
        setMembers(updatedMembers);
        setNewMemberEmail('');
    } catch (error) {
        console.error('Failed to add member:', error);
    }
};

  const handleOpenChat = () => {
    navigation.navigate('GroupChat', { groupId });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.chatButton} onPress={handleOpenChat}>
        <Text style={styles.chatButtonText}>Open Group Chat</Text>
      </TouchableOpacity>

      <View style={styles.addMemberContainer}>
        <TextInput
          style={styles.input}
          value={newMemberEmail}
          onChangeText={setNewMemberEmail}
          placeholder="Enter member email"
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddMember}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={members}
        renderItem={({ item }) => (
          <View style={styles.memberItem}>
            <Text style={styles.memberEmail}>{item}</Text>
          </View>
        )}
        keyExtractor={item => item}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  chatButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  chatButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  addMemberContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  memberItem: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
  },
  memberEmail: {
    fontSize: 16,
  },
});

export default GroupDetailScreen;