import React, { useState, useCallback, useEffect } from 'react'
import { Bubble, GiftedChat, InputToolbar, Send,} from 'react-native-gifted-chat'
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Avatar} from "@react-native-material/core";
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useUserContext } from '../../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';


export default function PatientMessages() {
  const [messages, setMessages] = useState([]);
  const [doctorData, setDoctor] = React.useState({});
  const [appointmentList, setAppointmentList] = React.useState();
  const [appointmentState, setAppointmentState] = React.useState(false);
  const { userData } = useUserContext();
  const trimmedUid = userData?.uid.trim();
  const doctorId = userData?.doctor.trim();
  const [secId, setSecId] = React.useState('');
  const navigation = useNavigation();
  const [senderData, setSenderData] = useState(null);

  React.useEffect(() => {
    if (userData && trimmedUid) {
      setSenderData({
        _id: trimmedUid,
        name: userData.firstName,
        avatar: userData.profilePictureURL,
      });
    }
  }, [userData, trimmedUid]);

  const fetchSecretary = async () => {
    try {
        const secSnapshot = await firestore()
            .collection('users')
            .where('role', '==', 2)
            .where('doctor', 'array-contains', doctorId)
            .get();

        if (!secSnapshot.empty) {
            const secDoc = secSnapshot.docs[0]; // Assuming you only have one secretary per doctor
            const sec = secDoc.data();
            setDoctor(sec);
            setSecId(sec.uid);
        }
    } catch (error) {
        console.error("Error fetching secretary:", error);
    }
}

  useEffect(() => {
    console.log(userData);
  }, []);

  useEffect(() => {
    fetchSecretary();
  }, [userData]);

  const retrieveMessagesFromFirestore = async () => {
    try {  
      const chatRef = firestore().collection('messages');
      chatRef.where('sendTo', 'in', [trimmedUid, secId])
             .where('user._id', 'in', [trimmedUid, secId])
             .orderBy('createdAt', 'asc')
             .onSnapshot((snapshot) => {
              if (!snapshot) {
                return;
              }
              snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                  const messageData = change.doc.data();
                  if (!messageData.user || !messageData.user._id) {
                    return;
                  }
                  const newMessage = {
                    _id: change.doc.id,
                    user: messageData.user,
                    text: messageData.text,
                    createdAt: messageData.createdAt?.toDate() || new Date(),
                  };
                  setMessages((prevMessages) => {
                    if (prevMessages.some((message) => message._id === newMessage._id)) {
                      return prevMessages;
                    }
                    return GiftedChat.append(prevMessages, [newMessage]);
                  });
                }
              });
             });
  
    } catch (error) {
    }
  };
  

  useEffect(() => {
    retrieveMessagesFromFirestore();
  }, []);

  const fetchApprovedAssessments = () => {
    const now = new Date();
    const thirtyMinutesEarlier = new Date(now.getTime() - 30 * 60000); // 30 minutes earlier
    const thirtyMinutesLater = new Date(now.getTime() + 30 * 60000); // 30 minutes later
    

    const unsubscribe = firestore()
      .collection('appointments')
      .where('patient_assigned', '==', trimmedUid)
      .where('date', '>=', thirtyMinutesEarlier)
      .where('date', '<=', thirtyMinutesLater)
      .where('status', '==', 1)
      .orderBy('date', 'desc')
      .onSnapshot(
        (snapshot) => {
          const assessments = [];
          snapshot.forEach((doc) => {
            assessments.push(doc.data());
          });

          if (assessments.length > 0) {
            setAppointmentState(true);
            setAppointmentList(assessments);
          } else {
            setAppointmentState(false);
          }
        },
        (error) => {
        }
      );

    return unsubscribe;
  };

  React.useEffect(() => {
    const unsubscribe = fetchApprovedAssessments();
    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    sendMessagesToFirestore(messages);
    retrieveMessagesFromFirestore();
  }, []);

  const sendMessagesToFirestore = async (messages) => {
    try {
      for (const message of messages) {
        if (!senderData || !message.text || !secId) {
          console.error("One of the fields is undefined", { senderData, messageText: message.text, secId });
          return;
        }
  
        await firestore()
          .collection('messages')
          .add({
            user: senderData,
            text: message.text,
            createdAt: firestore.FieldValue.serverTimestamp(),
            sendTo: 'uYSNDSB0diRwEgwLaPWf5Wq2zYB3'
          });
      }
    } catch (error) {
      console.log('Error', error);
    }
  };
  

  /*toolbar customization*/
  const customInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        textInputStyle={{ color: 'black' }}
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
              onPress={()=>console.log(secId)}
              style={styles.profileAndOptions}
            >
              <Avatar 
                image={
                  <Image
                  source={doctorData?.profilePictureURL ? { uri: doctorData.profilePictureURL } : require('../../../assets/images/default.png')}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: 55,
                      height: 55,
                      borderRadius: 28,
                    }}
                  />
                } 
                color='black'
                size={55} />
              <View style={styles.nameAndClass}>
                <Text style={styles.username}>
                  {doctorData.firstName} {doctorData.lastName}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={{display:'flex', flexDirection:'row'}}>
              {appointmentState ? (
                <TouchableOpacity onPress={handleCall}>
                  <Icon name="phone" size={24} color={'black'}/>
                </TouchableOpacity>
              ) : (
                null
              )}
            </View>
          </View>
        </View>
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
    backgroundColor:'#f7f7f7',
    height:100,
    alignItems:'center',
    elevation: 4
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
    fontSize: 18,
    fontWeight: 'bold',
    color:'black'
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
    height: 'auto',
    color: 'black'
  },

  sendIcon: {
    fontSize: 25,
    color: '#3A97F9',
    padding: 10,
    marginRight: 5,
    borderColor: 'white',
  },

});
