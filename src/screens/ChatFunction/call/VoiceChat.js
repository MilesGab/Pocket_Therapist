import React, {useRef, useState, useEffect} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import {PermissionsAndroid, Platform} from 'react-native';
import {
ClientRoleType,
createAgoraRtcEngine,
IRtcEngine,
ChannelProfileType,
} from 'react-native-agora';

import { useNavigation } from '@react-navigation/native';
import { Avatar } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';

import Sound from 'react-native-sound';
import Ringtone from '../../../../assets/audio/ptring.mp3';

const appId = '8c9007f71b7c429d971501377a0772fe';
const channelName = 'newcall';
const token = '007eJxTYDhyUUl4mnSKW0acy7rT7NopG5qKGdtvmMxbWPiUJzTtf7ECg0WypYGBeZq5YZJ5somRZYqluaGpgaGxuXmigbm5UVrqL2+N1IZARgYddnsWRgYIBPHZGfJSy5MTc3IYGADtBh1v';
const uid = 0;

const VoiceChat = () =>{
    const agoraEngineRef = useRef(IRtcEngine); // Agora engine instance
    const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
    const [isDoctorJoined, setIsDoctorJoined] = useState(false);
    const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
    const [message, setMessage] = useState(''); // Message to the user

    const sound = new Sound(Ringtone, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Error loading sound: ', error);
        }
    });



    const getPermission = async () => {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            ]);
        }
    };

    function showMessage(msg) {
        setMessage(msg);
    }

    useEffect(() => {
        // Initialize Agora engine when the app starts
        setupVoiceSDKEngine();
     });
     
     const setupVoiceSDKEngine = async () => {
        try {
        // use the helper function to get permissions
        if (Platform.OS === 'android') { await getPermission()};
        agoraEngineRef.current = createAgoraRtcEngine();
        const agoraEngine = agoraEngineRef.current;
        agoraEngine.registerEventHandler({
            onJoinChannelSuccess: () => {
                showMessage('Successfully joined the channel ' + channelName);
                setIsJoined(true);
            },
            onUserJoined: (_connection, Uid) => {
                showMessage('Remote user joined with uid ' + Uid);
                setRemoteUid(Uid);
                setIsDoctorJoined(true);
            },
            onUserOffline: (_connection, Uid) => {
                showMessage('Remote user left the channel. uid: ' + Uid);
                setRemoteUid(0);
            },
        });
        agoraEngine.initialize({
            appId: appId,
        });
        } catch (e) {
            console.log(e);
        }
     };

     const join = async () => {
        if (isJoined) {
            return;
        }
        try {
            agoraEngineRef.current?.setChannelProfile(
                ChannelProfileType.ChannelProfileCommunication,
            );
            agoraEngineRef.current?.joinChannel(token, channelName, uid, {
                clientRoleType: ClientRoleType.ClientRoleBroadcaster,
            });
        } catch (e) {
            console.log(e);
        }
    };

    const leave = () => {
        try {
            agoraEngineRef.current?.leaveChannel();
            setRemoteUid(0);
            setIsJoined(false);
            showMessage('You left the channel');
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Avatar size={100} icon={<Icon name="person-circle-outline" size={100}/>} style={{marginBottom:12}}/>
                <Text style={{fontSize:28, color:'black'}}>Dr. Mico Ruiz Linco</Text>
                {isJoined ? (
                <Text>Local user uid: {uid}</Text>
                ) : (
                <Text>Ringing...</Text>
                )}
                {isJoined && remoteUid !== 0 ? (
                <Text>Remote user uid: {remoteUid}</Text>
                ) : (
                null
                )}
            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={leave} style={styles.endCall}>
                    <Icon style={{}} name="call" color={'white'} size={40}/>
                </TouchableOpacity>
                {isJoined ? (
                    null
                ) : (
                <TouchableOpacity onPress={join} style={[styles.endCall, {backgroundColor:'#3dcc44'}]}>
                    <Icon style={{}} name="call" color={'white'} size={40}/>
                </TouchableOpacity>
                )}
            </View>
        </View>
    );

}

const styles = StyleSheet.create({

    container: {
        height:'100%',
        width:'100%',
        display:'flex',
        justifyContent: 'center',
        alignContent:'center'
    },

    header: {
        justifyContent:'center',
        alignItems:'center',
        flex:1
    },

    footer: {
        flexDirection:'row',
        gap: 32,
        justifyContent:'center',
        alignItems:'center',
        marginBottom: 12
    }, 
    
    endCall: {
        borderRadius: 40,
        backgroundColor:'red',
        padding: 20,
        alignItems:'center'
    }

})

export default VoiceChat;