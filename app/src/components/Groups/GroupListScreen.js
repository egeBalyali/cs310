import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { UserContext } from '../../context/UserContext';
import {getGroups} from "../../api/api";

const GroupsListScreen = ({ navigation }) => {
    const { user } = useContext(UserContext);
    const [groups, setGroups] = useState([]);
  
    useEffect(() => {
      const fetchGroups = async () => {
        try {
          const groupsData = await getGroups(user.token, user.email);
          setGroups(groupsData);
        } catch (error) {
          console.error('Failed to fetch groups:', error);
        }
      };
      fetchGroups();
    }, [user.token]);
  
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateGroup')}>
          <Text style={styles.createButtonText}>Create New Group</Text>
        </TouchableOpacity>
  
        <FlatList
          data={groups}
          renderItem={({ item }) => (
            <View style={styles.groupItem}>
              <TouchableOpacity 
                style={styles.groupContent}
                onPress={() => navigation.navigate('GroupChat', { groupId: item.id })}
              >
                <Text style={styles.groupName}>Group {item.id}</Text>
                <Text style={styles.memberCount}>{item.members.length} members</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.detailsButton}
                onPress={() => navigation.navigate('GroupDetails', { groupId: item.id })}
              >
                <Text style={styles.detailsButtonText}>Details</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  createButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  createButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  groupContent: {
    flex: 1,
    padding: 16,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  memberCount: {
    color: '#666',
    marginTop: 4,
  },
  detailsButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GroupsListScreen;