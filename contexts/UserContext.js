import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Toast } from 'react-native'; // Assuming you are using a Toast library

const UserContext = React.createContext();

export function UserProvider({ children }) {
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadUserData() {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);        
        }
      } catch (error) {
        Toast.show('Error loading user data');
      } finally {
        setLoading(false);
      }
    }
    
    loadUserData();
  }, []);

  const updateUser = async (newUserData) => {
    const updatedUserData = { ...userData, ...newUserData };
    setUserData(updatedUserData);
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
    } catch (error) {
      Toast.show('Error saving user data');
    } finally {
      console.log('Success in changing! New data: ', updatedUserData);
    }
  }; 

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUserData(null);
    } catch (error) {
      Toast.show('Error during logout');
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return React.useContext(UserContext);
}
