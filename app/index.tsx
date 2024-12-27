import React from 'react';
import  AppNavigator from './src/navigation/AppNavigator';
import { UserProvider } from './src/context/UserContext';

const App = () => (
    <UserProvider>
        <AppNavigator />
    </UserProvider>
);

export default App;
