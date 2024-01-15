import React, { useState, useCallback } from 'react'
import { View, Text, StyleSheet, Pressable, Image, Alert} from 'react-native';
import { Avatar, IconButton, Box, ActivityIndicator } from "@react-native-material/core";
import Icon from 'react-native-vector-icons/Ionicons';
import { FlatList, ScrollView, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useUserContext } from '../../../../contexts/UserContext';
import { Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Item = ({ item, onPress, backgroundColor, textColor }) => {
  
  const { userData } = useUserContext();

  const timestamp = new Date(
      item?.date.seconds * 1000 + item?.date.nanoseconds / 1000000
    );
  
  const formattedDate = timestamp.toLocaleDateString('en-US', {
      month: 'long',
      weekday: 'long',
      day: '2-digit',
    });

  const formattedTime = timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

  return(
      <View style={[styles.item, {backgroundColor}]}>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', paddingHorizontal: 12, paddingVertical: 10,gap: 12}}>
            <Box style={{borderRadius: 20, paddingVertical: 8, paddingLeft:6}}>
              <Avatar label={item.firstName} size={55} 
                image={
                  <Image
                  source={item?.profilePictureURL ? { uri: item.profilePictureURL } : require('../../../../assets/images/default.png')}
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
                />
            </Box>
            <Box style={{paddingVertical: 8}}>
              <Text style={[styles.title, {color:textColor, fontWeight: 'bold'}]}>{item.patientName}</Text>
              <Text style={[styles.title, {color: textColor}]}>{item.name}</Text>
            </Box>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', marginHorizontal: 16, marginBottom: 20, backgroundColor:'#A8D5BA', borderRadius:4, paddingVertical: 4,paddingHorizontal: 12, gap: 32}}>
          <View style={{display: 'flex', flexDirection: 'row', alignItems:'center', gap: 6,flex: 1}}>
            <Icon name="calendar-outline" size={20}/>
            <Text>{formattedDate}</Text>
          </View>
          <View style={{display: 'flex', flexDirection: 'row', alignItems:'center', gap: 6}}>
            <Icon name="time-outline" size={20}/>
            <Text>{formattedTime}</Text>
          </View>
        </View>
      </View>
      )
  };


const DoctorScreen = ({ navigation }) => {
  
  const { userData } = useUserContext();
  const trimmedUid = userData?.uid?.trim();
  
  const [selectedId, setSelectedId] = React.useState();
  const [appointmentList, setAppointmentList] = React.useState([]);
  const [appointmentsCount, setAppointmentsCount] = React.useState(0); 
  const [patientCount, setPatientCount] = React.useState(0);
  const [secretary, setSecretary] = React.useState([]);

  const [loading, setLoading] = React.useState(true);


  const updateFCMToken = async () => {
    try {

      const currentFCMToken = await AsyncStorage.getItem('fcmtoken');
      const userRef = firestore().collection('users').doc(trimmedUid);
      const userSnapshot = await userRef.get();
  
      if (userSnapshot.exists) {
        const storedFCMToken = userSnapshot.data().notification_token;
  
        if (storedFCMToken && storedFCMToken === currentFCMToken) {
          console.log('FCM token is already stored:', currentFCMToken);
          return;
        }
      }

      Alert.alert(
        'Push Notifications',
        'Do you want to receive push notifications?',
        [
          {
            text: 'No',
            onPress: () => console.log('User declined notifications'),
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              console.log('User accepted notifications');
              await userRef.update({ notification_token: currentFCMToken });
              await AsyncStorage.setItem('fcmtoken', currentFCMToken);
            },
          },
        ],
        { cancelable: false },
      );
  
    } catch (error) {
      console.error('Error updating FCM token:', error);
    }
  };

  React.useEffect(()=>{
    updateFCMToken();
  },[userData]);

  const countPatients = () => {
    return firestore()
      .collection('users')
      .where('role', '==', 0)
      .where('doctor', '==', trimmedUid)
      .onSnapshot(snapshot => {
        const count = snapshot.size;
        setPatientCount(count);
      }, error => {
        console.error('Error fetching patients: ', error);
      });
  };
  
  React.useEffect(() => {
    const unsubscribe = countPatients();
    return () => unsubscribe();
  }, [userData]);

  const countAppointments = () => {
    const dateToday = new Date();
  
    return firestore()
      .collection('appointments')
      .where('doctor_assigned', '==', trimmedUid)
      .where('status', '==', 1)
      .where('date', '>=', dateToday)
      .onSnapshot(snapshot => {
        const count = snapshot.size;
        setAppointmentsCount(count);
      }, error => {
        console.error('Error fetching appointments:', error);
      });
  };
  
  React.useEffect(() => {
    const unsubscribe = countAppointments();
    return () => unsubscribe();
  }, [userData]);

  const fetchAppointments = () => {
    const dateToday = new Date();
  
    return firestore()
      .collection('appointments')
      .where('doctor_assigned', '==', trimmedUid)
      .where('status', '==', 1)
      .where('date', '>=', dateToday)
      .onSnapshot(async snapshot => {
        const appointmentsData = await Promise.all(
          snapshot.docs.map(async doc => {
            const appointmentData = doc.data();
            const doctorId = appointmentData.doctor_assigned;
            const patientId = appointmentData.patient_assigned;
  
            // Fetch doctor and patient data separately
            const [doctorSnapshot, patientSnapshot] = await Promise.all([
              firestore().collection('users').doc(doctorId).get(),
              firestore().collection('users').doc(patientId).get(),
            ]);
  
            const doctorData = doctorSnapshot.data();
            const patientData = patientSnapshot.data();
  
            return {
              ...appointmentData,
              doctorName: doctorData.firstName,
              patientName: patientData.firstName,
              profilePictureURL: patientData.profilePictureURL
            };
          })
        );
  
        setAppointmentList(appointmentsData);
        setLoading(false);
      }, error => {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      });
  };
  
  React.useEffect(() => {
    const fetchSecretary = async () => {
        try {
            const querySnapshot = await firestore().collection("users")
                .where("role", "==", 2)
                .where("doctor", "==", trimmedUid)
                .get();

            const fetchedSecretaries = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setSecretary(fetchedSecretaries);
        } catch (error) {
            console.error('Failed fetching secretary: ', error);
        }
    }

    fetchSecretary();
}, [trimmedUid]); 

  React.useEffect(() => {
    const unsubscribe = fetchAppointments();
    return () => unsubscribe();
  }, [userData]);

  const handleSearch = () =>{
    navigation.navigate('PatientSearch');
  }

  const handleSecretary = () =>{
    navigation.navigate('DoctorChatScreen', {patientData: secretary[0].uid});
  }

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#65A89F' : 'rgba(101, 168, 159, 1)';
    const color = item.id === selectedId ? 'white' : 'black';
  
    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.navigate('Profile')}>
          <Image
          source={userData?.profilePictureURL ? { uri: userData.profilePictureURL } : require('../../../../assets/images/default.png')}
          color='#CEDDF7'
          style={{
          width: 80,
          height: 80,
          borderRadius: 75,
          }}
        />
          </TouchableOpacity>
          <View style={{marginLeft:10, flex: 1}}>
            <Text style={styles.headerText}>Hello!</Text>
            <Text style={{
              fontFamily: 'Nunito Sans', 
              fontSize: 24, 
              color: 'black',
              }}>Dr. {userData?.firstName || '---'} {userData?.lastName || '---'}</Text>
          </View>
          <TouchableOpacity onPress={handleSecretary}>
            <Icon name="person-add-outline" color={'black'} size={26} />
          </TouchableOpacity>
        </View>

        <View style={styles.services}>
            <View style={{display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'space-evenly'}}>
              <Text style={{color:'black', fontSize: 28, fontWeight:'bold'}}>Summary</Text>
              <View style={{display:'flex', flexDirection:'column', gap: 12}}>
                <Box style={{width:'100%'}}>
                  <Box 
                      style={{
                      display:'flex',
                      backgroundColor: 'white',
                      width: '100%',
                      height: 120,
                      borderRadius: 12,
                      elevation: 4}}>
                          <View style={{display:'flex', flexDirection:'row', gap: 4, paddingHorizontal:12, paddingTop:12, alignItems:'center'}}>
                              <Icon name="body-outline" color={'#d15479'} size={24}/>
                              <Text style={{color: '#696969', flex:1, fontWeight:'bold', fontSize:18}}>Patients</Text>
                              <TouchableOpacity onPress={()=>navigation.navigate('Messages')}>
                                <Icon name="chevron-forward-outline" color={'#696969'} size={18}/>
                              </TouchableOpacity>
                          </View>
                          {loading ? (
                        <ActivityIndicator color={'gray'} size="large"/>
                        ): (
                          <>
                          <Divider bold={true} style={{marginHorizontal: 12, marginTop: 4, backgroundColor:'#696969'}}/> 
                          <Text style={{marginTop:8, color: 'black', paddingHorizontal: 12, fontSize:50}}>{patientCount || '0'}</Text>
                          </>
                          )}
                  </Box>
                </Box>
                {/* 2nd button */}
                <Box style={{width:'100%'}}>
                <Box 
                      style={{
                      display:'flex',
                      backgroundColor: 'white',
                      width: '100%',
                      height: 120,
                      borderRadius: 12,
                      elevation: 4}}>
                          <View style={{display:'flex', flexDirection:'row', gap: 4, paddingHorizontal:12, paddingTop:12, alignContent:'center', alignItems:'center'}}>
                              <Icon name="calendar-outline" color={'#478acc'} size={24}/>
                              <Text style={{ color: '#696969', flex:1, fontWeight:'bold', fontSize:18}}>Appointments</Text>
                          </View>
                      {loading ? (
                        <ActivityIndicator color={'gray'} size="large"/>
                        ): (
                        <>
                          <Divider bold={true} style={{marginHorizontal: 12, marginTop: 12, backgroundColor:'#696969'}}/> 
                          <Text style={{color: 'black', paddingHorizontal: 12, fontSize:50}}>{appointmentsCount}</Text>
                        </>
                        )}
                  </Box>
                </Box>
              </View>
            </View>
        </View>

        <View style={{display:'flex', justifyContent:'center', textAlign:'center'}}>
            <View style={{display:'flex', flexDirection:'row', paddingRight:10, alignItems:'center'}}>
                <Text style={styles.footerText}>Upcoming Appointments</Text>
                <TouchableOpacity onPress={()=>{navigation.navigate('Schedule')}}>
                    <Text style={{color:'#257cba'}}>See All</Text>
                </TouchableOpacity>
            </View>
            {loading ? 
            (
              <ActivityIndicator size="large"/>
            ) : (
              <FlatList
                horizontal={false}
                data={appointmentList}
                renderItem={renderItem}
                keyExtractor={item => item.uid}
                extraData={selectedId}
                showsVerticalScrollIndicator={false} 
                scrollEnabled={false}
                ListEmptyComponent={() => (
                  <View style={{marginTop: 12}}>
                    <Text style={{ textAlign: 'center' }}>No upcoming appointments</Text>
                  </View>
                )}
              />
            )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

  container: {
    justifyContent: 'space-between',
    padding: 20,
    paddingVertical: 32,
    height: '100%'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 32
  },
  headerText: {
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    color: 'black',
    fontStyle: 'normal',
    fontWeight: 'bold'
  },
  services: {
    marginBottom: 16
  },
  servicesText: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    color: 'black',
    fontStyle: 'normal',
    fontWeight: 'bold'
  },
  stats: {
    height: '35%',
    marginBottom: 16
  },
  footerText: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    color: 'black',
    fontStyle: 'normal',
    fontWeight: 'bold',
    flex: 1
  },
  item: {
    height: 132,
    width: '100%',
    borderRadius: 12,
    marginVertical: 8,
  },
  title: {
    fontSize: 18
  }
});

export default DoctorScreen;