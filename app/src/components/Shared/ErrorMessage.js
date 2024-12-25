import React from 'react';
import { Text, StyleSheet } from 'react-native';

const ErrorMessage = ({ message }) => <Text style={styles.error}>{message}</Text>;

const styles = StyleSheet.create({
    error: { color: 'red', marginBottom: 10 },
});

export default ErrorMessage;
