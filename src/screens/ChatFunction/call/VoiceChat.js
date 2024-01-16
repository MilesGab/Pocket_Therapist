import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import {
    ClientRoleType,
    createAgoraRtcEngine,
    IRtcEngine,
    RtcSurfaceView,
    ChannelProfileType,
} from 'react-native-agora';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from '@react-native-firebase/app';
import { useUserContext } from '../../../../contexts/UserContext';

const appId = '8c9007f71b7c429d971501377a0772fe';
const channelName = 'ptchannel';

const VoiceChat = () => {
    const navigation = useNavigation();
    const { userData } = useUserContext();
    const role = userData?.role === 0 ? 0 : 1;
    const agoraEngineRef = useRef(IRtcEngine);
    const [isJoined, setIsJoined] = useState(false);
    const [remoteUid, setRemoteUid] = useState(0);
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);

    const toggleVideo = () => {
        if (isJoined) {
            agoraEngineRef.current?.muteLocalVideoStream(isVideoEnabled);
            setIsVideoEnabled(!isVideoEnabled);
            showMessage(`Video ${isVideoEnabled ? 'disabled' : 'enabled'}`);
        }
    };

    const showMessage = (msg) => {
        setMessage(msg);
    };

    const setupVideoSDKEngine = async () => {
        try {
            if (Platform.OS === 'android') {
                await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                ]);
            }
            agoraEngineRef.current = createAgoraRtcEngine();
            agoraEngineRef.current.initialize({
                appId: appId,
                channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
            });
            agoraEngineRef.current.enableVideo();
            agoraEngineRef.current.registerEventHandler({
                onJoinChannelSuccess: () => {
                    setIsJoined(true);
                    showMessage('Successfully joined the channel ' + channelName);
                },
                onUserJoined: (_connection, Uid) => {
                    setRemoteUid(Uid);
                    showMessage('Remote user joined with uid ' + Uid);
                },
                onUserOffline: (_connection, Uid) => {
                    setRemoteUid(0);
                    showMessage('Remote user left the channel. uid: ' + Uid);
                },
            });
        } catch (e) {
            console.log(e);
        }
    };

    const retrieveToken = async () => {
        try {
            const response = await firebase.app().functions('asia-southeast1').httpsCallable('tokenGeneration')({
                role: role,
                channelName: channelName,
            });
            setToken(response.data.token);
        } catch (error) {
        } finally {
            // join();
        }
    };

    const join = async () => {
        if (!isJoined && token) {
            agoraEngineRef.current?.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
            agoraEngineRef.current?.startPreview();
            agoraEngineRef.current?.joinChannel(token, channelName, role, {
                clientRoleType: ClientRoleType.ClientRoleBroadcaster,
            });
        }
    };

    useEffect(() => {
        setupVideoSDKEngine().then(()=>{
            agoraEngineRef.current.startPreview();
        });
        retrieveToken();
    }, []);

    useEffect(() => {
        return () => {
            if (agoraEngineRef.current) {
                agoraEngineRef.current.leaveChannel();
            }
        };
    }, []);

    useEffect(()=>{
        console.log("Token", token);
    },[token])

    const leave = () => {
        try {
            agoraEngineRef.current?.leaveChannel();
            setIsJoined(false);
            setRemoteUid(0);
            showMessage('You left the channel');
            navigation.goBack();
        } catch (e) {
            console.log(e);
        }
    };

    const toggleCamera = () => {
        agoraEngineRef.current?.switchCamera();
    };

    return (
        <SafeAreaView style={styles.main}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContainer}>
                {isVideoEnabled && (
                    <RtcSurfaceView
                        canvas={{ uid: 0 }}
                        style={{position: 'absolute', top: 0, left: 0, zIndex: 1, width: '40%', height: 200, left: 20,top:20}}
                    />
                )}
                {isJoined ? (
                    <>
                        {remoteUid !== 0 && (
                            <RtcSurfaceView
                                canvas={{ uid: remoteUid }}
                                style={styles.videoView}
                            />
                        )}
                        <View style={styles.btnContainer}>
                            <View style={{display:'flex', flexDirection:'row', height:90}}>
                                <TouchableOpacity onPress={toggleCamera} style={styles.button}>
                                <Icon name="camera-reverse-outline" color="white" size={40} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={toggleVideo} style={styles.button}>
                                    <Icon name={isVideoEnabled ? "videocam-outline" : "videocam-off-outline"} color="white" size={40} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={leave} style={[styles.button, { backgroundColor: 'red' }]}>
                                    <Icon name="call-outline" color="white" size={40} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                ) : (
                    <View style={{bottom: 0, height: 700, display:'flex',flexDirection:'column', justifyContent: 'flex-end',alignItems:'center'}}>
                        <Text>
                            Are you ready to join the call? {message}
                        </Text>
                        <View style={{display:'flex', flexDirection:'row'}}>
                        <TouchableOpacity onPress={leave} style={[styles.button, { backgroundColor: 'red' }]}>
                            <Icon name="call-outline" color="white" size={40} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={join} style={[styles.button, { backgroundColor: 'green' }]}>
                            <Icon name="call-outline" color="white" size={40} />
                        </TouchableOpacity>
                        </View>
                    </View>
                )}
                <View style={{bottom: 0, height: 700, display:'flex',flexDirection:'column', justifyContent: 'flex-end',alignItems:'center'}}>
                    <Text>{message}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};


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
        backgroundColor:'#f5f5f5'
    },

    scroll: {
        flex: 1, 
        width: '100%',
    },

    scrollContainer: {
        alignItems: 'center'
    },

    videoView: {
        width: '100%',
        height: 800,
    },

    btnContainer: {
        flexDirection: 'column', 
        justifyContent: 'center',
        bottom: 100,
        position:'absolute',
        height: '100%'
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