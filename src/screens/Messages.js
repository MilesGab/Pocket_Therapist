
import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text, Image} from 'react-native';
import { Avatar} from "@react-native-material/core";
import { useUserContext } from '../../contexts/UserContext';

const MessagesData = [
    
    //hardcoded database data
    {
        id: '1',
        userName: 'Sana Minatozaki',
        userImg: require("../assets/images/user1.png"),
        messageTime: '4 minutes ago',
        messageText: 'Shy shy shy'

    },

    {
        id: '2',
        userName: 'Chaewon Kim',
        userImg: require("../assets/images/user2.png"),

        messageTime: '5 minutes ago',
        messageText: 'dododok'
    },
]


const Messages = ({navigation}) => {
    return(
        <View style = {styles.container}>
            <View style={styles.header}>
                <Text style ={styles.headerTxt}>Messages</Text>
            </View>
            <FlatList
                data={MessagesData}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
            <TouchableOpacity onPress={() => navigation.navigate('Contact', {userName: item.userName})} style={styles.cardStyle}>
            <View style = {styles.userInfo}>
                <View style = {styles.userImgWrapper}>
                  <Image style = {styles. userImgStyle} source={item.userImg} />
                </View>
                <View style = {styles.messageSection}>
                  <View style ={styles.messageDetails}>
                    <Text style = {styles.userName}>{item.userName}</Text>
                    <Text style = {styles.timeReceived}>{item.messageTime}</Text>
                  </View>
                  <Text style = {styles.messagePreview}>{item.messageText}</Text>
                </View>
            </View>
            </TouchableOpacity>
            )}
            />
        </View>
    );
};

const styles = StyleSheet.create({

container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
},

cardStyle: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 10,
},

userInfo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 5
},

userImgWrapper: {
    paddingTop: 15,
    paddingBottom: 15,
},

userImgStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
},

messageSection: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
    paddingLeft: 0,
    marginLeft: 10,
    width: 300,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc'
},

messageDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
},

userName: {
  fontSize: 14,
  fontWeight: 'bold',
  fontFamily: 'Lato-Regular',
},

timeReceived: {
  fontSize: 12,
  color: '#666',
  fontFamily: 'Lato-Regular'
},

messagePreview: {
  fontSize: 14,
  color: '#333333'
},

header: {
    flexDirection: 'row',
    backgroundColor:'white',
    paddingTop: 20,
    paddingBottom: 10,
    height:100,
    alignItems:'center',
 
  },

headerTxt:{
    fontSize: 40,
    fontWeight: 'bold',
    paddingLeft: 10,
    color: 'black'
}
})

export default Messages;