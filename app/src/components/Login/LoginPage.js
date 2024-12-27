import React, { useContext, useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { UserContext } from '../../context/UserContext';
const API_URL = "http://10.0.2.2:8080/"
const LoginPage = ({ navigation }) => {
    const { setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const url = API_URL + 'login';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save email and token in context
                setUser({ email, token: data.data });
                navigation.navigate('Home'); // Navigate to Home page
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Go to Register" onPress={() => navigation.navigate('Register')} /> {/* Link to RegisterPage */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 },
    error: { color: 'red', marginTop: 10 },
});

export default LoginPage;
