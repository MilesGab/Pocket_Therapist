import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUserContext } from '../../contexts/UserContext';
import { FlatList } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { Divider } from '@react-native-material/core';


const Notification = ( props ) => {
  const { userData, updateUser } = useUserContext();
  const doctor_name = props.patientName;
  const date = props.date;


  
  const timestamp = new Date(
    date.seconds * 1000 + date.nanoseconds / 1000000
  );

  const formattedDate = timestamp.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  const formattedTime = timestamp.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return(
    <View style={{display:'flex',
      backgroundColor:'white', 
      width:'100%', 
      justifyContent:'center', 
      alignContent:'center',
      paddingHorizontal:10, 
      paddingVertical:6,
      borderRadius:12,
      marginBottom: 16
      }}
      >
      <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom:6}}>
        <View style={{flexDirection:'column', flex:1}}>  
          <Text>Appointment Date</Text>
          <Text style={{fontWeight:'bold', color:'black', fontSize:16}}>{formattedDate} {formattedTime}</Text>
        </View>
        <TouchableOpacity onPress={()=>{console.log(props.doctorName)}}>
          <Icon name="ellipsis-vertical" style={{fontSize:20}}/>
        </TouchableOpacity>
      </View>
      <Divider/>
      <View style={{marginTop: 6, paddingVertical:12, flexDirection:'row'}}>
        <View style={{marginLeft: 10, flexDirection:'column'}}>
          <Text style={{fontWeight:'bold', color:'black', fontSize:16}}>{doctor_name}</Text>
        </View>
      </View>
    </View>
  )
}

const Notifications = () => {
  const { userData, updateUser } = useUserContext();
  const [apptReqList, setApptReqList] = React.useState([]);
  const trimmedUid = userData.uid.trim();

  const fetchApptRequest = async () => {
    try {
      const appointmentsSnapshot = await firestore()
        .collection('appointments')
        .where('doctor_assigned', '==', trimmedUid)
        .where('status', '==', 0)
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

      setApptReqList(appointmentsData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  React.useEffect(() => {
    fetchApptRequest();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom: 48}}>
        <Text style={{fontSize: 32, color: 'black', fontWeight:'bold', flex: 1}}>Notifications</Text>
        <TouchableOpacity onPress={()=>{}}>
          <Icon name="add-circle-outline" style={{fontSize:38, color:'black', marginRight: 12}}/>
        </TouchableOpacity>
      </View>
      <View id="services">
        <Text>Appointment Requests</Text>
            <View>
            <FlatList
            horizontal={false}
            data={apptReqList}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => (
              // Render your AppointmentCard component here for each item
              <Notification {...item}/>
            )}
            showsVerticalScrollIndicator={false}
          />
            </View>
            <TouchableOpacity onPress={()=>{console.log(apptReqList)}}>
              <Text>HI</Text>
            </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
    height: '100%',
    padding: 20,
  },
});

export default Notifications;
