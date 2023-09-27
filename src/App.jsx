import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/Homescreen/Homescreen.js';
import Schedule from './screens/Schedule.js';
import Notifications from './screens/Notifications.js';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Login from './screens/Login.js';
import Register from './screens/Register.js';
import auth from '@react-native-firebase/auth';
import Routes from './navigation/Routes.js';
import { UserProvider } from '../contexts/UserContext.js';



export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <UserProvider>
      <NavigationContainer>
        <Routes user={user}/>
      </NavigationContainer>
    </UserProvider>
  );
}
