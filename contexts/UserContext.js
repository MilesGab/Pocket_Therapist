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
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);        
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
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData'); // Remove user data from AsyncStorage
      setUserData(null); // Clear the user data in the state
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return React.useContext(UserContext);
}