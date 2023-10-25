import React, { useState, useCallback } from 'react'
import {Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useUserContext } from '../../../../contexts/UserContext';
import messaging from '@react-native-firebase/messaging';
import DoctorMessages from '../../ChatFunction/DoctorMessages';
import AsyncStorage from '@react-native-async-storage/async-storage';


const requestUserPermission = async () =>{
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  if (enabled){
      console.log('Authorization:', authStatus);
      GetFCMToken();
  }
}

async function GetFCMToken(){
  let fcmtoken=await AsyncStorage.getItem("fcmtoken");
  console.log(fcmtoken,"old token");
  if(!fcmtoken){

    try{
      const fcmtoken = await messaging().getToken();
    if(fcmtoken){
      console.log(fcmtoken,"new token");
    await AsyncStorage.setItem("fcmtoken",fcmtoken);
    }
    }catch(error){
      console.log(error, "fcmtoken error")
    }
}
}

React.useEffect(()=>{
  if(requestUserPermission()){
    messaging().getToken().then(token =>{
      console.log(token);
    });
  }
  else{
    console.log("Failed token", authStatus);
  }

{/* started app after tapping notif */}
  messaging().getInitialNotification().then( async (remoteMessage) => {if (remoteMessage) {
    console.log('Notification caused app to open from quit state:', remoteMessage.notification);
    if(userData?.role === 0){
      navigation.navigate(DoctorMessages);
      }else{

      }    
  }
    setLoading(false);
  });

{/* opened after tapping notif */}
  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    console.log('Notification caused app to open from background state:', remoteMessage.notification);
  
    if (userData?.role === 0) {
      // Assuming fetchLatestMessagesData() is a function that retrieves the latest messages data
      const latestMessagesData = await fetchLatestMessagesData();
      
      navigation.navigate('DoctorMessaging', { latestMessagesData });
    } else {
      // Handle navigation for other roles if needed
    }
  });


{/* notif whilst app in background */}
messaging().onNotificationOpenedApp(async (remoteMessage) => {
console.log('Notification caused app to open from background state:', remoteMessage.notification);

if (userData?.role === 0) {
  // Assuming fetchLatestMessagesData() is a function that retrieves the latest messages data
  const latestMessagesData = await fetchLatestMessagesData();
  
  navigation.navigate('DoctorMessaging', { latestMessagesData });
} else {
  // Handle navigation for other roles if needed
}
});


{/* notif whilst inside the app */}
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
          if(userData?.role === 0){
    navigation.navigate('DoctorMessaging');
    }else{

    }
  });
  return unsubscribe;  
}, [])

  const fetchLatestMessagesData = async () => {
    try {
      const messagesRef = firestore().collection('messages');
      const querySnapshot = await messagesRef.orderBy('timestamp', 'desc').limit(10).get();

      const latestMessages = [];
      querySnapshot.forEach((doc) => {
        latestMessages.push(doc.data());
      });

      return latestMessages;
    } catch (error) {
      console.error('Error fetching latest messages:', error);
      return [];
    }
  };