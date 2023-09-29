import React, {useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Homescreen/Homescreen.js';
import Schedule from '../screens/Schedule.js';
import Notifications from '../screens/Notifications.js';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Login from '../screens/Login.js';
import Register from '../screens/Register.js';
import Profile from '../screens/Profile.js';
import PatientMessages from '../screens/ChatFunction/PatientMessages.js';
import DoctorMessages from '../screens/ChatFunction/DoctorMessages.js';
import Media from '../MediaScreen/Media.js';
import Assessment from '../screens/Assessment/Assessment.js';
import { useUserContext } from '../../contexts/UserContext.js';
import DoctorChatScreen from '../screens/ChatFunction/DoctorChatScreen.js';
import Media from '../screens/Media.js';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            style={styles.tabItemContainer}
          >
            {options.tabBarIcon({ color: isFocused ? '#007bff' : '#ccc', size: 30 })}
            <Text style={[styles.tabLabel, { color: isFocused ? '#007bff' : '#ccc' }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home" tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icon name="home-outline" color={color} size={size} />,
          tabBarLabel: 'Home',
        }}
      />

      <Tab.Screen
        name="Schedule"
        component={Schedule}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icon name="calendar" color={color} size={size} />,
          tabBarLabel: 'Schedule',
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessageStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icon name="chatbox-ellipses-outline" color={color} size={size} />,
          tabBarLabel: 'Messages',
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icon name="notifications" color={color} size={size} />,
          tabBarLabel: 'Notifications',
        }}
      />
      <Tab.Screen
        name="Media"
        component={Media}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icon name="images-outline" color={color} size={size} />,
          tabBarLabel: 'Media',
        }}
      />
    </Tab.Navigator>
  );
}

const MessageStack = () => {
  const { userData, updateUser } = useUserContext();
  useEffect(() => {
    if (userData) {
      if (userData.role === 0) {
        // Perform actions for patient users
        console.log('Chat accessed as patient');
      } else if (userData.role === 1) {
        // Perform actions for doctor users
        console.log('Chat accessed as doctor');
      }
    }
  }, [userData]);

return (
  <Stack.Navigator>
    {userData?.role === 0 ? (
      <Stack.Screen
        name="PatientMessaging"
        component={PatientMessages}
        options={{headerShown: false, initialParams: { role: 0 } }}
      />
    ) : (
      <Stack.Screen
        name="DoctorMessaging"
        component={DoctorMessages} // Use the imported component
        options={{headerShown: false, initialParams: { role: 1 } }} // role 1 is for doctors
      />
    )}
    <Stack.Screen 
    name= "DoctorChatScreen" 
    component={DoctorChatScreen} 
    options={({route}) => ({
      headerTitle: `${userData.firstName}`,
        headerStyle: {
          backgroundColor:'#DCEDF9',
          height: 80
        },
    }
    )
  } 
    />
  </Stack.Navigator>
);
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10
  },
  tabItemContainer: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 10
  },
});

const Routes = (props) => {
  const {userData,updateUser} = useUserContext();

  React.useEffect(()=>{
    console.log(userData);
  }, [])

    return(
        <Stack.Navigator initialRouteName={props.user ? 'MyTabs' : 'Login'} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="MyTabs" component={MyTabs}/>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Assessment" component={Assessment} />
        </Stack.Navigator>
    )
}

export default Routes;