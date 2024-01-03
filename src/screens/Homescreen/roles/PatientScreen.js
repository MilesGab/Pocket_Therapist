import React from 'react';
import { View, Text, StyleSheet, Alert, Image } from 'react-native';
import { Avatar, IconButton, Box } from "@react-native-material/core";
import { Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { FlatList, ScrollView, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from "@react-native-material/core";
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../../../../contexts/UserContext';
import { requestUserPermission } from '../../../utils/pushnotification_helper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Item = ({ item, onPress, backgroundColor, textColor }) => {
  
  const { userData } = useUserContext();

  const timestamp = new Date(
      item.date.seconds * 1000 + item.date.nanoseconds / 1000000
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
        <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', paddingHorizontal: 12, paddingVertical: 18,gap: 12}}>
            <Box style={{borderRadius: 20, paddingVertical: 8, paddingLeft:6}}>
              <Avatar label={item.firstName} size={55} 
                image={
                  <Image
                  source={item?.profilePictureURL ? { uri: item.profilePictureURL } : require('../../../../assets/images/default.png')}
                  style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 28,
                    width: '100%',
                    height:'100%'
                  }}
                  />
                  }
                />
            </Box>
            <Box style={{paddingVertical: 8}}>
              <Text style={[styles.title, {color:textColor, fontWeight: 'bold'}]}>Dr. {item.doctorName}</Text>
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

const PatientScreen = ({ navigation }) => {
  const { userData, updateUser } = useUserContext();
  const [selectedId, setSelectedId] = React.useState();
  const [appointmentList, setAppointmentList] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);

  const trimmedUid = userData?.uid.trim();

  const updateFCMToken = async () => {

    try{

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
              const userRef = firestore().collection('users')
              .doc(trimmedUid);
  
              userRef.update({
                notification_token: fcmtoken
              });
            },
          },
        ],
        { cancelable: false },
      );

      console.log('Updated notification token: ', fcmtoken)

    } catch(e){
      console.error(e);
    }
    
    let fcmtoken = await AsyncStorage.getItem('fcmtoken');
  }

  React.useEffect(()=>{
    updateFCMToken();
  },[userData]);


  React.useEffect(() => {
    setLoading(true);
  
    const dateToday = new Date();
    const appointmentsRef = firestore()
      .collection('appointments')
      .where('patient_assigned', '==', trimmedUid)
      .where('date', '>=', dateToday)
      .where('status', '==', 1)
      .limit(1);
  
    const unsubscribe = appointmentsRef.onSnapshot(async (querySnapshot) => {
      try {
        const appointmentsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const appointmentData = doc.data();
            const doctorSnapshot = await firestore()
              .collection('users')
              .doc(appointmentData.doctor_assigned)
              .get();
            const patientSnapshot = await firestore()
              .collection('users')
              .doc(trimmedUid)
              .get();
  
            const doctorData = doctorSnapshot.data();
            const patientData = patientSnapshot.data();
  
            return {
              ...appointmentData,
              doctorName: doctorData?.lastName,
              doctorPhoto: doctorData?.profilePictureURL,
              patientName: patientData?.firstName,
            };
          })
        );
  
        setAppointmentList(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, [trimmedUid]);
  
  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#65A89F' : '#257cba';
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

  const handleExercisesPage = (userid) => {
    navigation.navigate('MyExercises', {patientData: userid});
  }

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>👋 Hello!</Text>
            <Text style={{
              fontFamily: 'Nunito Sans', 
              fontSize: 28, 
              color: 'black', 
              fontWeight: 'bold'}}>{userData?.firstName || '---'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
              source={userData?.profilePictureURL ? { uri: userData?.profilePictureURL } : require('../../../../assets/images/default.png')}
              color='#CEDDF7'
              style={{
              width: 80,
              height: 80,
              borderRadius: 75,
              }}
          />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.servicesText}>Summary</Text>
        <LatestResults/>

        <View style={styles.services}>
          <Text style={styles.servicesText}>Services</Text>
              {/* <View style={{marginTop: 12, display: 'flex', flexDirection: 'row', gap: 12, justifyContent: 'center', paddingHorizontal: 16}}>
              <IconButton
                onPress={() => navigation.navigate('Assessment')}
                style={{
                  backgroundColor: '#D1B655',
                  width: '50%',
                  height: 80,
                  borderRadius: 8,
                }}
                icon={props => <Icon name="clipboard-outline" color={'#F2F2F2'} size={36} />}
              />
              <IconButton
                onPress={() => handleExercisesPage(trimmedUid)}
                style={{
                  backgroundColor: '#D1B655',
                  width: '50%',
                  height: 80,
                  borderRadius: 8,
                }}
                icon={props => <Icon name="accessibility-outline" color={'#F2F2F2'} size={36} />}
              />
              </View> */}
              <View style={{backgroundColor:'white', padding: 12, borderRadius: 12, elevation: 4}}>
                <TouchableOpacity onPress={() => navigation.navigate('Assessment')} style={styles.serviceBtn}>
                  <Icon name="clipboard-outline" color={'#4a7fd4'} size={36} style={{right: 12}}/>
                  <Text style={{fontSize: 16, fontWeight:'bold', color:'black', flex:1}}>Take Assessment</Text>
                  <Icon name="chevron-forward-outline" size={20}/>
                </TouchableOpacity>
                <Divider style={{marginVertical: 12}}/>
                  <TouchableOpacity onPress={() => handleExercisesPage(trimmedUid)} style={styles.serviceBtn}>
                  <Icon name="accessibility-outline" color={'#d19245'} size={36} style={{right: 12}}/>
                  <Text style={{fontSize: 16, fontWeight:'bold', color:'black', flex:1}}>View Exercises</Text>
                  <Icon name="chevron-forward-outline" size={20}/>
                </TouchableOpacity>
              </View>
        </View>
      
        <View style={styles.footer}>
          <Text style={styles.footerText}>Upcoming Appointment</Text>
          {isLoading ? (
            <ActivityIndicator size="large"/>
          ) : (
            <View style={{justifyContent:'center', alignContent:'center', alignItems:'center'}}>
              <FlatList
                horizontal={true}
                data={appointmentList}
                renderItem={renderItem}
                keyExtractor={item => item.uid}
                extraData={selectedId}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={() => (
                  <View style={{marginTop: 12, padding: 20}}>
                    <Text style={{ textAlign: 'center' }}>No upcoming appointments</Text>
                  </View>
                )}
              />
            </View>
          )}
            
        </View>
      </View>
  );
};

const LatestResults = () =>{
  const { userData, updateUser } = useUserContext();
  const [dataList, setDataList] = React.useState({});
  const [isLoading, setLoading] = React.useState(false);
  const trimmedUid = userData?.uid.trim();

  const navigation = useNavigation();

  const resultsMap = [
    'YES'
  ];

  React.useEffect(() => {
    setLoading(true);
    fetchResults();
  }, [])

  const fetchResults = async () => {
    try {
      const assessmentsRef = firestore()
        .collection('assessments')
        .where('patient', '==', trimmedUid)
        .orderBy('date', 'desc')
        .limit(1);
  
      const unsubscribe = assessmentsRef.onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setDataList(doc.data());
        });
        setLoading(false);
      });
  
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
    }
  };
  

  const timestamp = new Date(
    dataList?.date?.seconds * 1000 + dataList?.date?.nanoseconds / 1000000
  );

  const formattedDate = timestamp.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  const outputDate = formattedDate !== 'Invalid Date' ? formattedDate : '';

  const handleAssessmentHistory = () =>{
    navigation.navigate('AssessmentHistory')
  }

  return(
    <View style={styles.stats}>
      <Box w={'100%'} h={'auto'} style={{ backgroundColor: "white", borderRadius: 16, elevation: 4}}>
          <Box style={{padding: 16, display: 'flex', flexDirection: 'row'}}>
            <Box style={{flex: 1}}>
              <Box style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom: 20}}>
                <Icon name="heart-outline" color="red" size={20} style={{right: 4}}/>
                <Text style={{fontFamily: 'Nunito Sans', fontWeight:'bold', fontSize: 20, color: 'black', flex:1}}>Last Assessment</Text>
                {isLoading ? (
                  <Text>Getting date...</Text>
                ) : (
                  <TouchableOpacity onPress={()=>handleAssessmentHistory()} style={{display:'flex',flexDirection:'row', alignItems:'center'}}>
                    <Text style={{color: '#696969'}}>{outputDate}</Text>
                    <Icon name="chevron-forward-outline" size={14} color={'#696969'}/>
                  </TouchableOpacity>
                )}
              </Box>
              {isLoading ? (
                <View style={{height:'100%', marginTop:60}}>
                  <ActivityIndicator size="large" color="blue" />
                  <Text style={{textAlign:'center'}}>Retrieving data...</Text>
                </View>
              ) : (
                <>
                  <View style={{marginBottom: 40}}>
                    <Text style={{fontFamily: 'Nunito Sans', fontWeight:'normal', fontSize: 16, color: '#696969', fontWeight:'bold'}}>Maximum wrist range of motion:</Text>
                    <Text style={{fontSize: 32, fontWeight:'bold', color:'black'}}>{dataList.maxAngle}°</Text>
                  </View>
                  {dataList && dataList.painData ? (
                  <View style={{display:'flex', flexDirection:'row', borderTopWidth: 1, justifyContent:'space-evenly'}}>
                    <View style={{paddingTop: 4}}>
                      <Text style={{fontWeight:'bold', color:'#696969', fontSize: 12 }}>VAS Score</Text>
                      <Text style={{color:'black', fontSize: 24, fontWeight:'bold'}}>{dataList?.painData[0]}</Text>
                    </View>

                    <View style={{borderLeftWidth: 1, borderColor: 'black'}} />

                    <View style={{paddingTop: 4}}>
                      <Text style={{fontWeight:'bold', color:'#696969', fontSize: 12 }}>Pain</Text>
                      <Text style={{color:'black', fontSize: 24, fontWeight:'bold'}}>{dataList?.painData[1]}</Text>
                    </View>

                    <View style={{borderLeftWidth: 1, borderColor: 'black'}} />
                    
                    <View style={{paddingTop: 4}}>
                      <Text style={{fontWeight:'bold', color:'#696969', fontSize: 12 }}>Warm?</Text>
                      <Text style={{color:'black', fontSize: 24, fontWeight:'bold'}}>{dataList?.phyiscalData[3]}</Text>
                    </View>
                  </View>
                  ) : (
                    null
                  )}
                </>
              )}
            </Box>
          </Box>
      </Box>
    </View>
  )
}

const styles = StyleSheet.create({
  
  container: {
    height:'100%',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 32
  },

  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  headerText: {
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    color: '#343434',
    fontStyle: 'normal',
    fontWeight: 'bold'
  },

  services: {
    marginBottom: 16,
  },

  servicesText: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    color: '#343434',
    fontStyle: 'normal',
    fontWeight: 'bold',    
    marginBottom: 12
  },

  serviceBtn: {
    display:'flex', 
    flexDirection:'row',
    alignContent:'center', 
    alignItems:'center',
    paddingHorizontal: 12
    },

  stats: {
    height: '35%',
    marginBottom: 2
  },

  footer: {
    width: '100%'
  },

  footerText: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    color: '#343434',
    fontStyle: 'normal',
    fontWeight: 'bold'
  },

  item: {
    paddingHorizontal: 12,
    height: 150,
    width: 'auto',
    borderRadius: 12,
    marginVertical: 8,
    marginBottom: 12
  },

  title: {
    fontSize: 18
  }
});

export default PatientScreen;
