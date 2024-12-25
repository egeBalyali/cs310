import React from 'react';
import  AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/context/UserContext';

const App = () => (
    <UserProvider>
        <h1>Welcome to Howudoin</h1>
        <AppNavigator />
    </UserProvider>
);

export default App;
