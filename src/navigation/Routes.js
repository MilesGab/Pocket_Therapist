import React, {useEffect} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Schedule from '../screens/Schedule.js';
import Notifications from '../screens/Notifications/Notifications.js';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Login from '../screens/Login.js';
import Register from '../screens/Register.js';
import Profile from '../screens/Profile/Profile.js';
import PatientMessages from '../screens/ChatFunction/PatientMessages.js';
import DoctorMessages from '../screens/ChatFunction/DoctorMessages.js';
import Assessment from '../screens/Assessment/Assessment.js';
import { useUserContext } from '../../contexts/UserContext.js';
import DoctorChatScreen from '../screens/ChatFunction/DoctorChatScreen.js';
import VoiceChat from '../screens/ChatFunction/call/VoiceChat.js';
import Media from '../screens/Media.js';
import PatientAssessment from '../screens/ChatFunction/assessments/PatientAssessments.js';
import Exercises from '../screens/ChatFunction/assessments/Exercises.js';
import AssessmentPage from '../screens/ChatFunction/assessments/AssessmentPage.js';
import PatientScreen from '../screens/Homescreen/roles/PatientScreen.js';
import DoctorScreen from '../screens/Homescreen/roles/DoctorScreen.js';
import PatientSearch from '../screens/Homescreen/roles/components/SearchPatient.js';

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
            {options.tabBarIcon({ color: isFocused ? '#65A89F' : '#ccc', size: 30 })}
            <Text style={[styles.tabLabel, { color: isFocused ? '#65A89F' : '#ccc' }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

function MyTabs() {
  const { userData, updateUser } = useUserContext();

  return (
    <Tab.Navigator
      initialRouteName="Home" tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
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
          tabBarIcon: ({ color, size }) => <Icon name="calendar-outline" color={color} size={size} />,
          tabBarLabel: 'Schedule',
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessageStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icon name="chatbox-ellipses-outline" color={color} size={size} />,
          tabBarLabel: userData?.role === 0 ? 'Doctor' : 'Patient'
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icon name="notifications-outline" color={color} size={size} />,
          tabBarLabel: 'Notifications',
        }}
      />
      { userData?.role === 1 ? (
        <Tab.Screen
        name="Media"
        component={Media}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icon name="images-outline" color={color} size={size} />,
          tabBarLabel: 'Media',
        }}
      />
      ) : (null)}
    </Tab.Navigator>
  );
}

const HomeStack = () => {
  const { userData, updateUser } = useUserContext();

  useEffect(() => {
    if (userData) {
      if (userData.role === 0) {
        console.log('Homescreen accessed as patient');
      } else if (userData.role === 1) {
        console.log('Homescreen accessed as doctor');
      }
    }
  }, [userData]);

return (
  <Stack.Navigator>
    {userData?.role === 0 ? (
      <Stack.Screen
        name="PatientHomescreen"
        component={PatientScreen}
        options={{headerShown: false, initialParams: { role: 0 } }}
      />
    ) : (
      <Stack.Screen
        name="DoctorHomescreen"
        component={DoctorScreen} // Use the imported component
        options={{headerShown: false, initialParams: { role: 1 } }} // role 1 is for doctors
      />
    )}

  <Stack.Screen 
    name="PatientSearch"
    component={PatientSearch}
    options={{headerShown: false}}
    />

  </Stack.Navigator>
);
};

const MessageStack = () => {
  const { userData, updateUser } = useUserContext();
  useEffect(() => {
    if (userData) {
      if (userData.role === 0) {
        console.log('Chat accessed as patient');
      } else if (userData.role === 1) {
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
      headerTitle: `Messages`,
        headerStyle: {
          backgroundColor:'#DCEDF9',
          height: 80
        },
      })
    } 
    />
    <Stack.Screen 
    name="VoiceChat"
    component={VoiceChat}
    options={{headerShown: false}}
    />

    <Stack.Screen 
    name="PatientAssessment"
    component={PatientAssessment}
    options={{headerShown: false}}
    />
    
    <Stack.Screen 
    name="Exercises"
    component={Exercises}
    options={{headerShown: false}}
    />

    <Stack.Screen 
    name="AssessmentPage"
    component={AssessmentPage}
    options={{headerShown: false}}
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
    paddingTop: 10,
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
  const { userData, updateUser } = useUserContext();

    return(
        <Stack.Navigator 
          initialRouteName={props.user ? 'MyTabs' : 'Login'} 
          screenOptions={{ 
            headerShown: false, 
            }}>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="MyTabs" component={MyTabs}/>
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Assessment" component={Assessment} />
        </Stack.Navigator>
    )
}

export default Routes;