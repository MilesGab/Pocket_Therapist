import React, { useState, useCallback, useEffect } from 'react'
import { Bubble, GiftedChat, InputToolbar, Send,} from 'react-native-gifted-chat'
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Avatar, ActivityIndicator} from "@react-native-material/core";
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useUserContext } from '../../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';


export default function PatientMessages() {
  const [messages, setMessages] = useState([]);
  const [doctorData, setDoctor] = React.useState({});
  const [appointmentState, setAppointmentState] = React.useState(false);
  const { userData } = useUserContext();
  const trimmedUid = userData.uid.trim();
  const doctorId = userData.doctor.trim();
  const navigation = useNavigation();

  const senderData = {
    _id: trimmedUid,
    name: userData.firstName,
    avatar:
      userData?.profilePictureURL,
  };

  const fetchDoctor = async () => {
    try {
      const querySnapshot = await firestore()
        .collection('users')
        .where('uid', '==', doctorId)
        .get();

      if (!querySnapshot.empty) {
        const doctorDoc = querySnapshot.docs[0];
        const doctor = doctorDoc.data();
        setDoctor(doctor);
      } else {
        console.log('No doctor found with the provided ID.');
      }
    } catch (error) {
      console.error('Error fetching doctor: ', error);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  const retrieveMessagesFromFirestore = async () => {
    try {  
      const chatRef = firestore().collection('messages');
      chatRef.where('sendTo', 'in', [trimmedUid, doctorId])
             .where('user._id', 'in', [doctorId, trimmedUid])
             .orderBy('createdAt', 'desc')
             .onSnapshot((snapshot) => {
               snapshot.docChanges().forEach((change) => {
                 if (change.type === 'added') {
                   const messageData = change.doc.data();
                   const newMessage = {
                     _id: change.doc.id,
                     user: messageData.user,
                     text: messageData.text,
                     createdAt: messageData?.createdAt?.toDate() || new Date(),
                   };
                   setMessages((prevMessages) => {
                    if (prevMessages.some((message) => message._id === newMessage._id)) {
                      return prevMessages;
                    }
                    return [...prevMessages, newMessage];
                  });
                 }
               });
             });
    } catch (error) {
      console.error('Error retrieving messages from Firestore:', error);
      throw error;
    }
  };

  useEffect(() => {
    retrieveMessagesFromFirestore();
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    sendMessagesToFirestore(messages);
    retrieveMessagesFromFirestore();
  }, []);

  const sendMessagesToFirestore = async (messages) => {
    try {
      for (const message of messages) {
        await firestore()
          .collection('messages')
          .add({
            user: senderData,
            text: message.text,
            createdAt: firestore.FieldValue.serverTimestamp(),
            sendTo: doctorId
          });
      }
    } catch (error) {
      console.error('Error sending messages to Firestore:', error);
    }
  };

  /*toolbar customization*/
  const customInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
      />
    );
  };

  /*send button customization*/
  const renderSend = (props) => {
    return (
      <Send {...props} containerStyle={{ borderWidth: 0 }}>
        <Icon name="send" style={styles.sendIcon} />
      </Send>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#3A97F9',
          },
          left: {
            backgroundColor: 'white',
          },
        }}
      />
    );
  };

  const handleCall = () => {
    navigation.navigate('VoiceChat');
  }

  return (
    
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileOptions}>
            <TouchableOpacity
              onPress={() => console.log(doctorData)}
              style={styles.profileAndOptions}
            >
              <Avatar 
                label={doctorData.firstName} 
                image={
                  <Image
                    source={{ uri: doctorData?.profilePictureURL }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 28,
                    }}
                  />
                } 
                size={55} />
              <View style={styles.nameAndClass}>
                <Text style={styles.username}>
                  {doctorData.firstName} {doctorData.lastName}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="video-camera" size={24}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCall}>
              <Icon name="phone" size={24}/>
            </TouchableOpacity>
          </View>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color='#65A89F'/>
      ) : (
        <View style={styles.toolbarContainer}>
          
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{ _id: trimmedUid }}
            renderSend={(props) => renderSend(props)}
            renderInputToolbar={(props) => customInputToolbar(props)}
            renderBubble={(props) => renderBubble(props)}
            alwaysShowSend={true}
          />
        </View>
      )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  header: {
    flexDirection: 'row',
    backgroundColor:'#DCEDF9',
    paddingTop: 20,
    paddingBottom: 10,
    height:100,
    alignItems:'center',
 
  },

  backBtn:{
    alignSelf:'center',
    paddingHorizontal: 10,
  },

  profileAndOptions:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    flex: 1,
    paddingHorizontal: 10
  },
  
  profileOptions:{
    flex:1,
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center',
    paddingHorizontal: 10
  },

  profile:{
    flexDirection: 'row',
    flex: 4,

  },

  username:{
    fontSize: 14,
    fontWeight: 'bold',
  },

  class:{
    fontSize: 12,
  },

  nameAndClass:{
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  toolbarContainer:{
    flex:1,
    paddingBottom:15,
  },

  inputToolbar: {
    marginHorizontal: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    height: 'auto'

  },

  sendIcon: {
    fontSize: 25,
    color: '#3A97F9',
    padding: 10,
    marginRight: 5,
    borderColor: 'white',
  },

});
