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

import firestore from '@react-native-firebase/firestore';
import { useUserContext } from '../../../../contexts/UserContext';


const appId = '8c9007f71b7c429d971501377a0772fe';
const channelName = 'newcall';
// const token = '007eJxTYHDgmGkis9NL3H5hkM1dnm+v/33g2fRJ7PMMx/ebZgUe375KgcEi2dLAwDzN3DDJPNnEyDLF0tzQ1MDQ2Nw80cDc3CgtdVFXZWpDICODx2FtFkYGCATx2RnyUsuTE3NyGBgAvgMg3Q==';

const VoiceChat = () =>{
    const { userData } = useUserContext();
    const trimmedUid = userData.uid.trim();
    const uid = 0;
    const agoraEngineRef = useRef(IRtcEngine); // Agora engine instance
    const [isJoined, setIsJoined] = useState(false); // Indicates if the local user has joined the channel
    const [isDoctorJoined, setIsDoctorJoined] = useState(false);
    const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
    const [message, setMessage] = useState(''); // Message to the user
    const [token, setToken] = useState('');
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

    const retrieveToken = async () =>{
        try{
            const userRef = await firestore().collection('users')
                                       .where('uid', '==', trimmedUid)
                                       .get();

           if (!userRef.empty) {
            const userData = userRef.docs[0].data();
            setToken(userData.user_token)
            } else {
                console.log('No doctor found with the provided ID.');
            }
        }catch(e){
            console.error('Error fetching token:', e);
        }
    };

    useEffect(()=>{
        retrieveToken();
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
                    // <>
                    // <React.Fragment key={0}>
                    // <RtcSurfaceView canvas={{uid: 0}} style={[styles.videoView,{width:'50%'}]} />
                    // <Text>Local user uid: {uid}</Text>
                    // </React.Fragment>
                    // <React.Fragment key={remoteUid}>
                    // <RtcSurfaceView
                    //     canvas={{uid: remoteUid}}
                    //     style={styles.videoView}
                    // />
                    // <Text>Remote user uid: {remoteUid}</Text>
                    // </React.Fragment>
                    // </>
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
                    </>
                ) : (
                    <Text>Waiting for a remote user to join</Text>
                )}
                <Text style={styles.info}>{message}</Text>
            </ScrollView>
            <View style={styles.btnContainer}>
                <Text onPress={join} style={styles.button}>
                    Join
                </Text>
                <TouchableOpacity onPress={leave} style={[styles.button,{backgroundColor: 'red'}]}>
                    <Icon name="call-outline" color="white" size={40}/>
                </TouchableOpacity>
                <Text onPress={toggleVideo} style={styles.button}>
                    {isVideoEnabled ? ( 
                        <Icon name="videocam-outline" color="white" size={40}/>
                    ) : ( 
                        <Icon name="videocam-off-outline" color="white" size={40}/>
                    )}
                </Text>
            </View>
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
        height: 600
    },

    btnContainer: {
        flexDirection: 'row', 
        justifyContent: 'center',
        paddingVertical: 20
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