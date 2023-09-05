import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, InputToolbar, Send,} from 'react-native-gifted-chat'
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Avatar} from "@react-native-material/core";
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Contact() {

  const [messages, setMessages] = useState([])

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])

  
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])

  {/*toolbar customization*/}
  const customInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
      />
    );
  };

  {/*send button customization*/}
  const renderSend = props => {
    return (
      <Send {...props} containerStyle = {{borderWidth:0}}>
        <Icon
          name="send"
          style={styles.sendIcon}
        />
      </Send>
    );
  }

  return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn}>
            <Icon name = "angle-left" size={20}/>
          </TouchableOpacity>
        <View style={styles.profileOptions}>
          <TouchableOpacity style = {styles.profileAndOptions}>
            <Avatar label={"Miles Gabriel Macabeo"} size={55}/>
              <View style = {styles.nameAndClass}>
                <Text style={styles.username}>Miles Gabriel Macabeo</Text>
                <Text style={styles.class}>Orthopedic Doctor (St. Lukes Hospital)</Text>
              </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style = {styles.toolbarContainer}>
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{_id: 1,}}
            renderSend={props => renderSend(props)}
            renderInputToolbar={props => customInputToolbar(props)}
            alwaysShowSend={true}
          />
      </View>
    </View>
  </TouchableWithoutFeedback>
  )
};

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
