import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUserContext } from '../../../contexts/UserContext';
import { FlatList } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import { 
  ActivityIndicator, 
  Divider,   
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  Button,
  Provider
} from '@react-native-material/core';
import AppointmentList from './components/AppointmentList';
import AssessmentList from './components/AssessmentList';

const Notification = ({ item, fetchApptRequest }) => {
  const { userData, updateUser } = useUserContext();
  const patient_name = item.patientName;
  const date = item.date;
  const appointmentId = item.uid;

  const [isOpen, setIsOpen] = React.useState(false);
  const [decision, setDecision] = React.useState('');
  
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

  const handleApprove = () =>{
    setDecision('Approve');
    setIsOpen(true);
  };

  const handleReject = () =>{
    setDecision('Reject');
    setIsOpen(true);
  };

  const approveAppointment = async () => {

    try{
      const appointmentRef = firestore().collection('appointments').doc(appointmentId);
    
      appointmentRef.update({
        status: 1
      });
    } catch (error) {
      console.error('Error updating appointment: ', error);
    } finally {
      fetchApptRequest();
    }

  }

  const rejectAppointment = async () => {

    try{
      const appointmentRef = firestore().collection('appointments').doc(appointmentId);
    
      appointmentRef.delete();
    } catch (error) {
      console.error('Error updating appointment: ', error);
    } finally {
      fetchApptRequest();
    }

  }

  return(
    <View style={{display:'flex',
      backgroundColor:'#faf0be', 
      width:'100%', 
      justifyContent:'center', 
      alignContent:'center',
      paddingHorizontal:10, 
      paddingVertical:6,
      borderRadius:16,
      marginBottom: 16
      }}
      >
      <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom:6}}>
        <View style={{marginHorizontal: 5, flexDirection:'column', flex:1}}>  
          <Text>Appointment Date</Text>
          <View style={{flexDirection:'row'}}>
            <Text style={{fontWeight:'bold', color:'black', fontSize:16, flex:1}}>{formattedDate} {formattedTime}</Text>
            <Text style={{fontWeight:'bold', color:'black', fontSize:16}}>{item.name}</Text>
          </View>
        </View>
      </View>
      <Divider/>
      <View style={{marginTop: 6, paddingVertical:12, flexDirection:'row', width:'100%'}}>
        <View style={{marginLeft: 5, flexDirection:'column', width:'100%'}}>
          <Text>Patient Name</Text>
          <Text style={{fontWeight:'bold', color:'black', fontSize:16, marginBottom: 10}}>{patient_name}</Text>
          <View style={{display:'flex', flexDirection:'row', justifyContent:'flex-end', alignItems:'center', paddingHorizontal: 20, gap: 12}}>
            <TouchableOpacity onPress={handleReject} style={{borderWidth: 1, borderColor:'#DC6F6F', paddingVertical:4, paddingHorizontal: 6, borderRadius:4}}>
              <Text style={{color:'red'}}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApprove} style={{backgroundColor:'#6FA8DC', paddingVertical:4, paddingHorizontal: 6, borderRadius:4}}>
              <Text style={{color:'white'}}>Approve</Text>
            </TouchableOpacity>
            <RequestDialog visible={isOpen} approveAppointment={approveAppointment} rejectAppointment={rejectAppointment} decision={decision} setVisible={setIsOpen} date={formattedDate} time={formattedTime}/>
          </View>
        </View>
      </View>
    </View>
  )
}

const RequestDialog = (props) => {

  const decision = props.decision;

  return(
    <Dialog visible={props.visible} onDismiss={() => props.setVisible(false)}>
    <DialogHeader title={decision + ' Appointment'} />
    <DialogContent>
      <Text style={{fontSize:20}}>
        {decision} appointment for {props.date} at {props.time}?
      </Text>
    </DialogContent>
    <DialogActions>
      <Button
        title="Cancel"
        compact
        variant="text"
        onPress={() => props.setVisible(false)}
      />
      <Button
        title="Approve"
        compact
        variant="text"
        onPress={() => {
          if (decision === 'Approve') {
            props.approveAppointment();
          } else {
            props.rejectAppointment();
          
        }}}
      />
    </DialogActions>
  </Dialog>
  )
}

const Assessments = ({ item }) => {

  return(
    <View style={{display:'flex',
      backgroundColor:'white', 
      width:'100%', 
      justifyContent:'center', 
      alignContent:'center',
      paddingHorizontal:10, 
      paddingVertical:6,
      borderRadius:16,
      marginBottom: 16
      }}
      >
      <Text>{item.patientFirstName} has completed an assessment</Text>
    </View>
  )

}

const Notifications = () => {
  const { userData } = useUserContext();
  
  const [apptReqList, setApptReqList] = React.useState([]);
  const [assessmentList, setAssessmentList] = React.useState([]);

  const [isLoading, setLoading] = React.useState(true);
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
    } finally{
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchApptRequest();
  }, []);

  const fetchAssessmentResults = async (doctorId) => {
    try {
      const patientQuerySnapshot = await firestore()
        .collection('users')
        .where('doctor', '==', doctorId)
        .get();
  
      const assessments = [];
  
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
      for (const patientDoc of patientQuerySnapshot.docs) {
        const patientId = patientDoc.id;
        const patientFirstName = patientDoc.data().firstName + ' ' + patientDoc.data().lastName;
  
        const assessmentQuerySnapshot = await firestore()
          .collection('assessments')
          .where('patient', '==', patientId)
          .where('date', '>=', oneWeekAgo)
          .where('status', '==', 'unreviewed')
          .orderBy('date', 'desc')
          .get();
  
        assessmentQuerySnapshot.forEach((assessmentDoc) => {
          const data = assessmentDoc.data();
          data.patientFirstName = patientFirstName;
          assessments.push(data);
        });
      }
  
      setAssessmentList(assessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };
  
  React.useEffect(()=>{
    fetchAssessmentResults(trimmedUid);
  },[]);

  return (
    <Provider>
    <View style={styles.container}>
      <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom: 48}}>
        <Text style={{fontSize: 32, color: 'black', fontWeight:'bold', flex: 1}}>Notifications</Text>
      </View>
      <View id="services">
        {userData.role === 1 ? (
          <>
          <Text style={[styles.notifHeader, {color:'black'}]}>Appointment Requests</Text>
            <View style={{marginBottom: 12}}>
              {isLoading ? (
              <ActivityIndicator size="large" color="rgba(0,0,0,0.4)" style={{marginTop: 60}}/>
              ) : 
              (
              <FlatList
              horizontal={false}
              data={apptReqList}
              keyExtractor={(item) => item.uid}
              renderItem={({ item }) => (
                <Notification
                  item={item}
                  fetchApptRequest={fetchApptRequest}
                  />
              )}
              ListEmptyComponent={() => (
                <View>
                  <Text>No appointments available</Text>
                </View>
              )}
              showsVerticalScrollIndicator={false}
              />
              )}
            </View>
          <Text style={[styles.notifHeader, {color:'black'}]}>Recent Assessments</Text>
            <View style={{marginBottom: 12}}>
              {isLoading ? (
                <ActivityIndicator size="large" color="rgba(0,0,0,0.4)" style={{marginTop: 60}}/>
                ) : 
                (
                <FlatList
                horizontal={false}
                data={assessmentList}
                keyExtractor={(item) => item.uid}
                renderItem={({ item }) => (
                  <Assessments
                    item={item}
                  />
                )}
                ListEmptyComponent={() => (
                  <View>
                    <Text>No new assessments</Text>
                  </View>
                )}
                showsVerticalScrollIndicator={false}
                />
              )}
            </View>
            
          </>
        ) : (
          <>
            <Text style={[styles.notifHeader, {color:'black'}]}>Approved Appointments</Text>
              <View>
                <AppointmentList />
              </View>
            <Text style={[styles.notifHeader, {color:'black'}]}>Asessments</Text>
              <View>
                <AssessmentList />
              </View>
          </>
        )}
      </View>
    </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
  },

  notifHeader: {
    fontSize: 20,
    fontWeight:'bold',
    marginBottom: 12
  }
});

export default Notifications;
