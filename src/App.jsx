import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/Homescreen.js';
import Schedule from './screens/Schedule.js';
import Contact from './screens/Contact.js';
import Notifications from './screens/Notifications.js';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Login from './screens/Login.js';

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
        name="Contact"
        component={Contact}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icon name="chatbox-ellipses-outline" color={color} size={size} />,
          tabBarLabel: 'Contact',
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
    </Tab.Navigator>
  );
}

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

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="MyTabs" component={MyTabs}/>
        <Stack.Screen name="Contact" component={Contact}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
