import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, InputToolbar, Send,} from 'react-native-gifted-chat'
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Avatar} from "@react-native-material/core";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useUserContext } from '../../../contexts/UserContext';
import firestore from '@react-native-firebase/firestore';


export default function PatientMessages() {
  const [messages, setMessages] = useState([]);
  const [doctorData, setDoctor] = React.useState({});
  const { userData } = useUserContext();
  const trimmedUid = userData.uid.trim();
  const doctorId = userData.doctor.trim();

  const senderData = {
    _id: trimmedUid,
    name: userData.firstName,
    avatar:
      'https://55knots.com.au/wp-content/uploads/2021/01/Zanj-Avatar-scaled.jpg',
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
      const querySnapshot = await firestore()
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .get();

      const messages = [];

      querySnapshot.forEach((documentSnapshot) => {
        const messageData = documentSnapshot.data();
        const message = {
          _id: documentSnapshot.id,
          user: messageData.user,
          text: messageData.text,
          createdAt: messageData.createdAt.toDate(),
        };

        messages.push(message);
      });

      setMessages(messages);
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
              <Avatar label={doctorData.firstName} size={55} />
              <View style={styles.nameAndClass}>
                <Text style={styles.username}>
                  {doctorData.firstName} {doctorData.lastName}
                </Text>
                <Text style={styles.class}>
                  Orthopedic Doctor (St. Lukes Hospital)
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.toolbarContainer}>
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{ _id: trimmedUid }}
            renderSend={(props) => renderSend(props)}
            renderInputToolbar={(props) => customInputToolbar(props)}
            alwaysShowSend={true}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
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
    paddingTop: 15,
    paddingBottom:15,
  },

  inputToolbar: {
    marginLeft: 10,
    marginRight: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,

  },

  sendIcon: {
    fontSize: 25,
    color: '#3A97F9',
    padding: 10,
    marginRight: 5,
    borderColor: 'white',
  },

});
