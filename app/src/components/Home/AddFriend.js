import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import { addFriend, getSentRequests } from '../../api/api';
import { UserContext } from '../../context/UserContext';

export const AddFriendship = () => {
  const { user } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [sentRequests, setSentRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const response = await getSentRequests(user.token);
      if (response && response.length > 0) {
        // Only update if we received valid data
        setSentRequests(prevRequests => {
          // Merge existing requests with new ones, removing duplicates
          const allRequests = [...prevRequests, ...response];
          const uniqueRequests = Array.from(new Map(
            allRequests.map(request => [request.receiverEmail, request])
          ).values());
          return uniqueRequests;
        });
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Reduced polling frequency to prevent rapid state updates
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAddFriend = async () => {
    if (!email) {
      setStatus({ type: 'error', message: 'Please enter an email' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await addFriend(user.email, email, user.token);
      
      // Add new request to local state
      const newRequest = {
        receiverEmail: email,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      setSentRequests(prevRequests => {
        const exists = prevRequests.some(req => req.receiverEmail === email);
        if (!exists) {
          return [...prevRequests, newRequest];
        }
        return prevRequests;
      });

      setStatus({ type: 'success', message: 'Friend request sent successfully' });
      setEmail('');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const renderRequest = ({ item }) => (
    <View style={styles.requestItem}>
      <View style={styles.requestInfo}>
        <Text style={styles.requestEmail}>{item.receiverEmail}</Text>
        <Text style={styles.requestDate}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.pendingStatus}>Sent</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Enter friend's email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          editable={!loading}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
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

      <View style={styles.requestsContainer}>
        <Text style={styles.requestsTitle}>Sent Requests</Text>
        <FlatList
          data={sentRequests}
          renderItem={renderRequest}
          keyExtractor={(item, index) => `${item.receiverEmail}-${index}`}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No sent requests</Text>
          }
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
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
    fontSize: 16,
  },
  error: {
    color: '#dc3545',
    marginBottom: 16,
  },
  success: {
    color: '#28a745',
    marginBottom: 16,
  },
  requestsContainer: {
    flex: 1,
  },
  requestsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  requestInfo: {
    flex: 1,
  },
  requestEmail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: '#666',
  },
  pendingStatus: {
    fontSize: 14,
    color: '#f0ad4e',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 24,
  },
  listContainer: {
    flexGrow: 1,
  }
});