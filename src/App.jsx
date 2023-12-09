import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Routes from './navigation/Routes.js';
import { UserProvider, useUserContext } from '../contexts/UserContext.js';
import { NotificationListener, requestUserPermission } from './utils/pushnotification_helper.js';
import { Alert } from 'react-native';

export default function App() {
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    requestUserPermission();
    NotificationListener();
  },[])

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
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
