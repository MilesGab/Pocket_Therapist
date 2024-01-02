import React, {useRef, useState, useEffect} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import {PermissionsAndroid, Platform} from 'react-native';
import {
ClientRoleType,
createAgoraRtcEngine,
IRtcEngine,
RtcSurfaceView,
ChannelProfileType,
} from 'react-native-agora';

import { useNavigation } from '@react-navigation/native';
import { Avatar } from '@react-native-material/core';
import Icon from 'react-native-vector-icons/Ionicons';

import Sound from 'react-native-sound';
import Ringtone from '../../../../assets/audio/ptring.mp3';

import { getFunctions, httpsCallable } from '@react-native-firebase/functions';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { useUserContext } from '../../../../contexts/UserContext';

const appId = '8c9007f71b7c429d971501377a0772fe';
const channelName = 't2t';
// const token = '007eJxTYHDgmGkis9NL3H5hkM1dnm+v/33g2fRJ7PMMx/ebZgUe375KgcEi2dLAwDzN3DDJPNnEyDLF0tzQ1MDQ2Nw80cDc3CgtdVFXZWpDICODx2FtFkYGCATx2RnyUsuTE3NyGBgAvgMg3Q==';

const VoiceChat = () =>{
    const navigation = useNavigation();
    const { userData } = useUserContext();
    const trimmedUid = userData.uid.trim();
    const uid = 0;
    const agoraEngineRef = useRef(IRtcEngine); // Agora engine instance
    const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
    const [isDoctorJoined, setIsDoctorJoined] = useState(false);
    const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
    const [message, setMessage] = useState(''); // Message to the user
    const [token, setToken] = useState('');
    const [userToken, setUserToken] = useState('');
    const [isVideoEnabled, setIsVideoEnabled] = useState(false);


    const toggleVideo = () => {
        if (isJoined) {
            try {
                if (isVideoEnabled) {
                    agoraEngineRef.current?.muteLocalVideoStream(true);
                } else {
                    agoraEngineRef.current?.muteLocalVideoStream(false);
                }
                setIsVideoEnabled(!isVideoEnabled);
                showMessage(`Video ${isVideoEnabled ? 'disabled' : 'enabled'}`);
            } catch (e) {
                console.log(e);
            }
        }
    };

    // const retrieveToken = async () =>{
    //     try{
    //         const userRef = await firestore().collection('users')
    //                                    .where('uid', '==', trimmedUid)
    //                                    .get();

    //        if (!userRef.empty) {
    //         const userData = userRef.docs[0].data();
    //         setUserToken(userData.user_token)
    //         console.log(userToken);

    //         const videoTokenFunction = firebase.app.functions('asia-south1').httpsCallable('videoToken');
            
    //         const response = await videoTokenFunction({ user_token: userToken, uid: trimmedUid });
    //         const agoraToken = response.data.token;
    //         setToken(agoraToken);
    //         } else {
    //             console.log('No doctor found with the provided ID.');
    //         }
            
    //     }catch(e){
    //         console.error('Error fetching token:', e);
    //     }finally{
    //         console.log('CALL TOKEN: ', token);
    //     }
    // };

    useEffect(()=>{
        const options = { timeout: 5000 }; // 5000 milliseconds or 5 seconds
        const functionsInstance = getFunctions(firebaseApp, 'asia-south1');
        const videoTokenFunction = httpsCallable(functionsInstance, 'videoToken');

        videoTokenFunction({ user_token: userToken, uid: trimmedUid })
            .then(response => {
                console.log('Data is: ', String(response.data));
            })
            .catch((error) => {
                const code = error.code;
                const message = error.message;
                const details = error.details;

                console.log(code, message, details);
            });
    },[])

    const sound = new Sound(Ringtone, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Error loading sound: ', error);
        }
    });



    const getPermission = async () => {
        if (Platform.OS === 'android') {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.CAMERA,
            ]);
        }
    };

    function showMessage(msg) {
        setMessage(msg);
    }

    // useEffect(() => {
    //     // Initialize Agora engine when the app starts
    //     setupVoiceSDKEngine();
    //  });
     
    //  const setupVoiceSDKEngine = async () => {
    //     try {
    //     // use the helper function to get permissions
    //     if (Platform.OS === 'android') { await getPermission()};
    //     agoraEngineRef.current = createAgoraRtcEngine();
    //     const agoraEngine = agoraEngineRef.current;
    //     agoraEngine.registerEventHandler({
    //         onJoinChannelSuccess: () => {
    //             showMessage('Successfully joined the channel ' + channelName);
    //             setIsJoined(true);
    //         },
    //         onUserJoined: (_connection, Uid) => {
    //             showMessage('Remote user joined with uid ' + Uid);
    //             setRemoteUid(Uid);
    //             setIsDoctorJoined(true);
    //         },
    //         onUserOffline: (_connection, Uid) => {
    //             showMessage('Remote user left the channel. uid: ' + Uid);
    //             setRemoteUid(0);
    //         },
    //     });
    //     agoraEngine.initialize({
    //         appId: appId,
    //     });
    //     } catch (e) {
    //         console.log(e);
    //     }
    //  };

     useEffect(() => {
        // Initialize Agora engine when the app starts
        setupVideoSDKEngine();
     });
     
     const setupVideoSDKEngine = async () => {
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
            },
            onUserOffline: (_connection, Uid) => {
                showMessage('Remote user left the channel. uid: ' + Uid);
                setRemoteUid(0);
            },
        });
        agoraEngine.initialize({
            appId: appId,
            channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        });
        agoraEngine.enableVideo();
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
            agoraEngineRef.current?.startPreview();
            agoraEngineRef.current?.joinChannel(token, channelName, uid, {
                clientRoleType: ClientRoleType.ClientRoleBroadcaster,
            });
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(()=>{
        if(!isJoined){
            join();
            console.log('channel joined')
        }
        console.log('joined channel: ', token);
    },[token]);

    const leave = () => {
        try {
            agoraEngineRef.current?.leaveChannel();
            setRemoteUid(0);
            setIsJoined(false);
            showMessage('You left the channel');
            navigation.goBack();
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <SafeAreaView style={styles.main}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContainer}>
                {isJoined ? (
                    <>
                    </>
                ) : (
                    <Text>Connecting..</Text>
                )}
                {isJoined && remoteUid !== 0 ? (
                    <>
                        <RtcSurfaceView
                            canvas={{uid: remoteUid}}
                            style={styles.videoView}
                        />
                        {isVideoEnabled ? (
                            <RtcSurfaceView
                            canvas={{uid: 0}}
                            style={{position: 'absolute', top: 0, left: 0, zIndex: 1, width: '40%', height: 200, left: 20,top:20}}
                        />
                        ) : (
                            null
                        )}
                        <View style={styles.btnContainer}>
                            <TouchableOpacity onPress={toggleVideo} style={styles.button}>
                                {isVideoEnabled ? ( 
                                    <Icon name="videocam-outline" color="white" size={40}/>
                                ) : ( 
                                    <Icon name="videocam-off-outline" color="white" size={40}/>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={leave} style={[styles.button,{backgroundColor: 'red'}]}>
                                <Icon name="call-outline" color="white" size={40}/>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <TouchableOpacity onPress={leave} style={[styles.button,{backgroundColor: 'red'}]}>
                        <Icon name="call-outline" color="white" size={40}/>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#0055cc',
        margin: 5,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 60
    },

    main: {
        flex: 1, 
        alignItems: 'center',
    },

    scroll: {
        flex: 1, 
        width: '100%'
    },

    scrollContainer: {
        alignItems: 'center'
    },

    videoView: {
        width: '100%',
        height: 800,
    },

    btnContainer: {
        flexDirection: 'row', 
        justifyContent: 'center',
        paddingVertical: 40,
        position:'absolute',
        bottom: 0,
    },

    head: {
        fontSize: 20
    },
    
    info: {
        backgroundColor: '#ffffe0', 
        color: '#0000ff'
    }
});

export default VoiceChat;