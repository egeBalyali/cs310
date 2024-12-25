import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { UserContext } from '../context/UserContext';
import LoginPage from '../components/Login/LoginPage';
import HomePage from '../components/Home/HomePage';
import PendingRequests from '../components/Home/PendingRequests';
import {AddFriendship} from '../components/Home/AddFriend';
import RegisterPage from '../components/Login/RegisterPage';
const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user } = useContext(UserContext); // Get user state from context

    return (
        <NavigationIndependentTree>
        <NavigationContainer>
            <Stack.Navigator initialRouteName={user?.token ? 'Home' : 'Login'}>
                {/* Login Page */}
                <Stack.Screen
                    name="Login"
                    component={LoginPage}
                    options={{ headerShown: false }} // Hide header on Login Page
                />
                {/* Home Page */}
                <Stack.Screen
                    name="Home"
                    component={HomePage}
                    options={{ headerShown: true }} // Show header on other screens
                />
                {/* Pending Requests */}
                <Stack.Screen
                    name="PendingRequests"
                    component={PendingRequests}
                    options={{ headerShown: true }}
                />
                 <Stack.Screen name="AddFriendship" component={AddFriendship} />
                 <Stack.Screen name="Register" component={RegisterPage} />
            </Stack.Navigator>
        </NavigationContainer>
        </NavigationIndependentTree>
    );
};

export default AppNavigator;
