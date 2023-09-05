import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = React.createContext();

export function UserProvider({ children }) {
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    async function loadUserData() {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          setUserData(JSON.parse(storedUserData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
    
    loadUserData();
  }, []);

  const updateUser = async (newUserData) => {
    setUserData(newUserData);
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
    } catch (error) {
      console.error('Error saving user data:', error);
    } finally {
      console.log(userData);
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return React.useContext(UserContext);
}