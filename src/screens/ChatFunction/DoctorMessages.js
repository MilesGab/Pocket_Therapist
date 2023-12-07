
import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text, Image, TouchableWithoutFeedback } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import Sana from '../../assets/images/user1.png';
import Kim from '../../assets/images/user2.png';

import Icon from 'react-native-vector-icons/Ionicons';
import { ActivityIndicator, Avatar} from "@react-native-material/core";
import { useUserContext } from '../../../contexts/UserContext';

const DoctorMessages = ({navigation}) => {

    const { userData, updateUser } = useUserContext();
    const trimmedUid = userData?.uid.trim();
    const [patientList, setPatientList] = React.useState([]);

    const [selectedItemIndex, setSelectedItemIndex] = React.useState(-1);
    const [dropMenu, setDropMenu] = React.useState(false);
    const [isLoading, setLoading] = React.useState(true);

    const fetchPatients = async () => {
        try {
            const querySnapshot = await firestore()
              .collection('users')
              .where('role', '==', 0)
              .where('doctor', '==', trimmedUid)
              .get();
        
            const patientData = [];
        
            for (const doc of querySnapshot.docs) {
              const patient = {
                id: doc.id,
                firstName: doc.data().firstName,
                lastName: doc.data().lastName,
                userImg: doc.data().profilePictureURL,
              };
        
              const latestMessageSnapshot = await firestore()
                .collection('messages')
                .where('user._id', '==', doc.id)
                .limit(1)
                .get();
        
              if (!latestMessageSnapshot.empty) {
                const latestMessageData = latestMessageSnapshot.docs[0].data();
                const latestMessageTime = formatMessageTime(latestMessageData.createdAt.toDate());
        
                // Add the latest message information to the patient data
                patient.messageTime = latestMessageTime;
                patient.messageText = latestMessageData.text;
              } else {
                // Handle the case where no messages are found for the patient
                patient.messageTime = 'No messages';
                patient.messageText = '';
              }
        
              // const userImageRef = storage().ref().child(`users/7b574a23f46c10a63c1b5061249c92ab.jpg`);
              // const userImageUrl = await userImageRef.getDownloadURL();
              // patient.userImg = Sana;

              patientData.push(patient);
            }
        
            setPatientList(patientData);
      } catch(error){
        console.error('Error fetching patients: ', error);
      } finally {
        setLoading(false);
      }
    }
  
    const formatMessageTime = (messageDate) => {
        const now = new Date();
        const diffInMilliseconds = now - messageDate;
      
        const seconds = Math.floor(diffInMilliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
      
        if (seconds < 60) {
          return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
        } else if (minutes < 60) {
          return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        } else if (hours < 24) {
          return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        } else {
          return days === 1 ? '1 day ago' : `${days} days ago`;
        }
      };

    React.useEffect(()=>{
        fetchPatients();
    }, []);
    
    const handleMessage = (userid) => {
     console.log(userid);
     navigation.navigate('DoctorChatScreen', {patientData: userid});
    }

    const handleAssessments = (userid) => {
     navigation.navigate('PatientAssessment', {patientData: userid});
    }

    const handleExercises = (userid) => {
      navigation.navigate('Exercises', {patientData: userid});
    }

    const handleDropDown = (index) => {
      setSelectedItemIndex(index);
      setDropMenu(true);
    };
  
    const closeDropDown = () => {
      setSelectedItemIndex(-1);
      setDropMenu(false);
    };

    return(
      <TouchableWithoutFeedback onPress={closeDropDown}>
        <View style = {styles.container}>
            <View style={styles.header}>
                <Text style ={styles.headerTxt}>Patients</Text>
            </View> 
            {isLoading ? (
              <ActivityIndicator size="large"/>
            ) : (
              <FlatList
                data={patientList}
                keyExtractor={item => item.id}
                renderItem={({item, index}) => (
                    <TouchableOpacity onPress={() => handleDropDown(index)} style={styles.cardStyle} activeOpacity={1}>
                        <View style={styles.userInfo}>
                            <View style={styles.userImgWrapper}>
                                <Image style={styles. userImgStyle} source={{uri: item.userImg}} />
                            </View>
                              <View style={styles.messageSection}>
                                  <View style={styles.messageDetails}>
                                      <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
                                  </View>
                                  <View>
                                    <View style={{display:'flex', flexDirection:'column'}}>
                                      <View style={{display:'flex', flexDirection:'row', alignContent:'center', alignItems:'center'}}>
                                        <Icon name="chatbox-ellipses-outline" size={18}/>
                                        <Text style={styles.messagePreview}>{item.messageText} · </Text>
                                        <Text style={styles.timeReceived}>{item.messageTime}</Text>
                                      </View>
                                      <View style={{display:'flex', flexDirection:'row', alignContent:'center', alignItems:'center'}}>
                                        <Icon name="pulse-outline" size={18}/>
                                        <Text style={[styles.messagePreview, {fontSize: 14}]}>New assessment available!</Text>
                                      </View>
                                    </View>
                                  </View>
                              </View>
                        </View>
                        {selectedItemIndex === index && dropMenu && (
                            <View style={styles.dropMenu}>
                              <TouchableOpacity onPress={()=>handleMessage(item.id)}>
                                <View style={styles.menuContent}>
                                  <Icon name="chatbox-ellipses-outline" size={20} />
                                  <Text>View Messages</Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={()=>handleAssessments(item.id)} >
                                <View style={styles.menuContent}>
                                  <Icon name="pulse-outline" size={20} />
                                  <Text>View Assessments</Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={()=>handleExercises(item.id)} >
                                <View style={styles.menuContent}>
                                  <Icon name="accessibility-outline" size={20} />
                                  <Text>View Exercises</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          )}
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
        </TouchableWithoutFeedback>
    );  
};

const styles = StyleSheet.create({

container: {
    flex: 1,
    padding: 10,
},

cardStyle: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 10
},

userInfo: {
    backgroundColor:'#FFFFFF',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 5,
    paddingHorizontal: 12,
    elevation: 2
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
  marginLeft: 4,
  fontSize: 16,
  color: '#333333'
},


header: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 10,
    height:100,
    alignItems:'center',
 
  },

headerTxt:{
    fontSize: 35,
    fontWeight: 'bold',
    paddingLeft: 10,
    color: 'black'
},

dropMenu: {
  backgroundColor:'#DADADA',
  borderBottomRightRadius: 10,
  borderBottomLeftRadius: 10,
  padding: 12,
  display:'flex',
  flexDirection:'column',
  gap: 12
},

menuContent: {
  display:'flex', 
  flexDirection:'row',
  gap: 4
}
})

export default DoctorMessages;