import React from 'react';
import firebase from '../../../../config/firebase'; 
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

const TokenTest = () =>{
    const [token, setToken] = React.useState('');

    const firebaseConfig = {
        apiKey: "AIzaSyC1Yia3LyR-FxtTforHbBFxgs4jUoy1K14",
        authDomain: "pocket-therapist-ddbb0.firebaseapp.com",
        projectId: "pocket-therapist-ddbb0",
        storageBucket: "pocket-therapist-ddbb0.appspot.com",
        messagingSenderId: "473959584342",
        appId: "1:473959584342:web:aa6a54e71f3761cd7521f7",
        measurementId: "G-GZ6BZSM927"
      };

    const handlePress = async() => {
        const uid = 0; // Your logic to determine the UID
        const userToken = 't2t'; // Your logic to determine the user token

        const user = firebase.auth().currentUser;


        await firebase.app().functions('asia-south1').httpsCallable('videoToken')({
            uid: uid,
            user_token: userToken,
          })
        .then(response => {
            console.log(JSON.stringify(response.data));
        })
        .catch(error => {
            console.error(error);
        });
    
    };

    return(
        <View style={{height:'100%', width:'100%', justifyContent:'center', alignContent:'center', alignItems:'center'}}>
            <Button mode="contained" onPress={handlePress}>Get Token</Button>
            <Text>Token: {token}</Text>
        </View>
    )

}

export default TokenTest;