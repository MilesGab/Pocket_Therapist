import React from 'react';
import firebase from '@react-native-firebase/app';
import functions from '@react-native-firebase/functions';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';


const TokenTest = () => {
    const [token, setToken] = React.useState('');

    const handlePress = async () => {
        const user = firebase.auth().currentUser;
        if (user) {
            const idToken = await user.getIdToken();

            firebase.app().functions('asia-southeast1').httpsCallable('tokenGeneration')({
                role: 0,
                channelName: 't2t',
            })
            .then(response => {
                console.log(JSON.stringify(response.data));
                setToken(response.data.token);
            })
            .catch(error => {
                const code = error.code;
                const message = error.message;
                const details = error.details;

                console.log('Error Code: ', code, '\n', 'Message: ', message, '\n', 'Details: ', details);
            });
        } else {
            console.log("User not authenticated");
        }
    };

    return (
        <View style={{height:'100%', width:'100%', justifyContent:'center', alignContent:'center', alignItems:'center'}}>
            <Button mode="contained" onPress={handlePress}>Get Token</Button>
            <Text>Token: {token}</Text>
        </View>
    );
};

export default TokenTest;
