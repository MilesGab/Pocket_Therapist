import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { useUserContext } from '../../contexts/UserContext';
import { Box, Text } from '@react-native-material/core';

export default function Contact() {
  const [messages, setMessages] = useState([]);
  const { userData, updateUser } = useUserContext();

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: `Hello ${userData.firstName}`,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://55knots.com.au/wp-content/uploads/2021/01/Zanj-Avatar-scaled.jpg',
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      showUserAvatar={true}
      user={{
        _id: userData.uid,
        name: userData.firstName,
      }}
      renderAvatarOnTop={false}
      inverted={true}
      onPressAvatar={()=>{console.log('pressed!')}}
    />
  );
}