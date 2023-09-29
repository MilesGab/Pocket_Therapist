import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Avatar, IconButton, Box } from "@react-native-material/core";
import Icon from 'react-native-vector-icons/Ionicons';
import { blue } from 'react-native-reanimated';
import { FlatList, ScrollView, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useUserContext } from '../../../../contexts/UserContext';


const DoctorScreen = ({ navigation }) => {
  const { userData, updateUser } = useUserContext();
  const trimmedUid = userData?.uid.trim();
  
  const [selectedId, setSelectedId] = React.useState();
  const [appointmentList, setAppointmentList] = React.useState([]);
  const [appointmentsCount, setAppointmentsCount] = React.useState(0); 
  const [patientCount, setPatientCount] = React.useState(0);

  const countPatients = async () => {
    try{
      const querySnapshot = await firestore()
      .collection('users')
      .where('role', '==', 0)
      .where('doctor', '==', trimmedUid)
      .get();

      const count = querySnapshot.size;
      setPatientCount(count);

    } catch(error){
      console.error('Error fetching patients: ', error);
    }
  }

  React.useEffect(()=>{
    countPatients();
  }, []);

  const countAppointments = async () => {
    try {
      const querySnapshot = await firestore()
      .collection('appointments')
      .where('doctor_assigned', '==', trimmedUid)
      .where('status', '==', 1)
      .get();
        
        const count = querySnapshot.size;
        setAppointmentsCount(count);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  React.useEffect(() => {
    countAppointments();
  }, []);

  React.useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsSnapshot = await firestore()
          .collection('appointments')
          .where('doctor_assigned', '==', trimmedUid)
          .get();
  
          const appointmentsData = await Promise.all(
            appointmentsSnapshot.docs.map(async doc => {
              const appointmentData = doc.data();
              const doctorId = appointmentData.doctor_assigned; // Get the doctor ID from appointment data
              const patientId = appointmentData.patient_assigned; // Get the patient ID from appointment data
    
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
              };
            })
          );
  
        setAppointmentList(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);


  const Item = ({item, onPress, backgroundColor, textColor}) => {
    
    const timestamp = new Date(
        item.date.seconds * 1000 + item.date.nanoseconds / 1000000
      );
    
    const formattedDate = timestamp.toLocaleDateString('en-US', {
        weekday: 'long',
        day: '2-digit',
      });

    const formattedTime = timestamp.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

    return(
        <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', paddingHorizontal: 12, paddingVertical: 18,gap: 12}}>
            <Box style={{borderRadius: 20, paddingVertical: 8, paddingLeft:20}}>
            <Text style={[styles.title, { color: textColor, fontSize: 32, fontWeight: 'bold', width: 100}]}>
                {formattedDate}
            </Text>          
            </Box>
            <Box style={{paddingVertical: 8}}>
            <Text style={[styles.title, {color:textColor}]}>{formattedTime}</Text>
            <Text style={[styles.title, {color:textColor, fontWeight: 'bold'}]}>{item.patientName}</Text>
            <Text style={[styles.title, {color: textColor}]}>{item.name}</Text>
            </Box>
        </View>
        </TouchableOpacity>
        )
    };

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#1C6BA4' : '#257cba';
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

  const onPressFunction = () => {
    console.log(userData);
  }

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('Logout successful!');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };


  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={()=>navigation.navigate('Profile')}>
            <Avatar image={{ uri: "https://mui.com/static/images/avatar/1.jpg" }} label={userData?.firstName} />
          </TouchableOpacity>
          <View style={{marginLeft:10, flex: 1}}>
            <Text style={styles.headerText}>Hello!</Text>
            <Text style={{
              fontFamily: 'Nunito Sans', 
              fontSize: 24, 
              color: 'black',
              }}>Dr. {userData?.firstName || '---'} {userData?.lastName || '---'}</Text>
          </View>
          <TouchableOpacity>
            <Icon name="person-add-outline" color={'black'} size={26} />
          </TouchableOpacity>
        </View>

        <View style={styles.services}>
              <View style={{display: 'flex', flexDirection: 'row', gap: 20, justifyContent: 'center'}}>
              {/* 1st button */}
              <Box style={{width:'40%'}}>
                <Text style={{fontSize:18, color:'black'}}>Number of Patients</Text>
                <Box 
                    style={{
                    display:'flex',
                    backgroundColor: '#DCEDF9',
                    width: '100%',
                    height: 120,
                    borderRadius: 8}}>
                        <View style={{display:'flex', flexDirection:'row', paddingHorizontal:12, paddingTop:6, alignItems:'center'}}>
                            <Text style={{marginTop:8, color: 'black', flex:1, fontWeight:'bold', fontSize:18}}>Total</Text>
                            <Icon style={{fontWeight:'bold', fontSize:18, color:'black'}} name="chevron-down-outline"/>
                        </View>
                    <Text style={{marginTop:8, color: 'black', paddingHorizontal: 12, fontSize:50}}>{patientCount || '0'}</Text>
                </Box>
              </Box>
              {/* 2nd button */}
              <Box style={{width:'50%'}}>
                <Text style={{fontSize:18, color:'black'}}>Number of Appointments</Text>
                <Box 
                    style={{
                    display:'flex',
                    backgroundColor: '#DCEDF9',
                    width: '100%',
                    height: 120,
                    borderRadius: 8}}>
                        <View style={{display:'flex', flexDirection:'row', paddingHorizontal:12, paddingTop:6, alignItems:'center'}}>
                            <Text style={{marginTop:8, color: 'black', flex:1, fontWeight:'bold', fontSize:18}}>Total</Text>
                            <Icon style={{fontWeight:'bold', fontSize:18, color:'black'}} name="chevron-down-outline"/>
                        </View>
                    <Text style={{marginTop:8, color: 'black', paddingHorizontal: 12, fontSize:50}}>{appointmentsCount}</Text>
                </Box>
              </Box>
              {/* 3rd button */}
              </View>
        </View>

        <View style={{display:'flex', justifyContent:'center', textAlign:'center'}}>
            <View style={{display:'flex', flexDirection:'row', paddingRight:10, alignItems:'center'}}>
                <Text style={styles.footerText}>Upcoming Appointments</Text>
                <TouchableOpacity onPress={()=>{navigation.navigate('Schedule')}}>
                    <Text style={{color:'#257cba'}}>See All</Text>
                </TouchableOpacity>
            </View>
          <FlatList
            horizontal={false} // Set to false to display items vertically
            data={appointmentList}
            renderItem={renderItem}
            keyExtractor={item => item.uid}
            extraData={selectedId}
            showsVerticalScrollIndicator={false} // Optionally, hide vertical scroll indicator
            />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({

  container: {
    backgroundColor: 'white',
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
    borderRadius: 28,
    marginVertical: 8,
  },
  title: {
    fontSize: 18
  }
});

export default DoctorScreen;
