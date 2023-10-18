import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (enabled){
        console.log('Authorization:', authStatus);
        GetFCMToken();
    }
}

async function GetFCMToken() {
    let fcmtoken = await AsyncStorage.getItem('fcmtoken');
    console.log(fcmtoken, 'old token');
    if (!fcmtoken) {
      try {
        const newToken = await messaging().getToken();
        if (newToken) {
          console.log(newToken, 'new token');
          await AsyncStorage.setItem('fcmtoken', newToken);
        }
      } catch (error) {
        console.log(error, 'error fcmtoken');
      }
    }
}
  

export const NotificationListener=()=>{

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
        'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
    });

    messaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {console.log(
        'Notification caused app to open from quit state:',
            remoteMessage.notification,
        );
    }
    });  

    messaging().onMessage(async remoteMessage=>{
        console.log("foreground notification",remoteMessage);
    })
}