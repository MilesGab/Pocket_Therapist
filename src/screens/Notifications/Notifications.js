import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUserContext } from '../../../contexts/UserContext';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
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

      appointmentRef.update({
        status: 2,
        message : message
      });
    } catch (error) {
      console.error('Error updating appointment: ', error);
    } finally {
      fetchApptRequest();
    }

  }

  const [message, setMessage]= React.useState ();

  return(
    <View style={{display:'flex',
      backgroundColor:'#faf0be', 
      width:'100%', 
      justifyContent:'center', 
      alignContent:'center',
      paddingHorizontal:10, 
      paddingVertical:6,
      borderRadius:16,
      marginBottom: 16,
      elevation: 2,
      }}
      >
      <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom:6, paddingHorizontal: 20}}>
        <View style={{flexDirection:'column', flex:1}}>  
          <Text>Appointment Date</Text>
          <View style={{flexDirection:'row'}}>
            <Text style={{fontWeight:'bold', color:'black', fontSize:16, flex:1}}>{formattedDate} {formattedTime}</Text>
            <Text style={{fontWeight:'bold', color:'black', fontSize:16}}>{item.name}</Text>
          </View>
        </View>
      </View>
      <Divider/>
      <View style={{marginTop: 6, paddingVertical:12, paddingHorizontal: 20, flexDirection:'row', width:'100%'}}>
        <View style={{flexDirection:'column', width:'100%'}}>
          <Text style={{fontWeight:'bold', color:'black', fontSize:16}}>Patient: {doctor_name}</Text>
          <View style={{display:'flex', flexDirection:'row', justifyContent:'flex-end', alignItems:'center', gap: 12, marginTop: 12}}>
            <TouchableOpacity onPress={handleReject} style={{backgroundColor:'rgba(227, 85, 75, 0.2)', paddingVertical:8, paddingHorizontal: 16, borderRadius:10, alignContent:'center', alignItems:'center', justifyContent:'center'}}>
              <Text style={{color:'red', fontWeight:'bold', fontSize: 16}}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleApprove} style={{backgroundColor:'rgba(111, 168, 220, 0.4)', paddingVertical:8, paddingHorizontal: 16, borderRadius:10, alignContent:'center', alignItems:'center', justifyContent:'center'}}>
              <Text style={{color:'#358cdb', fontWeight:'bold', fontSize: 16}}>Approve</Text>
            </TouchableOpacity>
            <RequestDialog
  visible={isOpen}
  approveAppointment={approveAppointment}
  decision={decision}
  setVisible={setIsOpen}
  date={formattedDate}
  time={formattedTime}
  rejectAppointment={() => rejectAppointment(message)}
  message={message}
  setMessage={setMessage} // Pass the setMessage function here
/>
          </View>
        </View>
      </View>
    </View>
  )
}

const RequestDialog = (props) => {
  const { decision, visible, setVisible, date, time, approveAppointment, rejectAppointment, message, setMessage } = props;

  const handleAction = () => {
    if (decision === 'Approve') {
      approveAppointment();
    } else if (decision === 'Reject') {
      rejectAppointment();
    }
    setVisible(false);
  };

  return (
    <Dialog visible={visible} onDismiss={() => setVisible(false)}>
      <DialogHeader title={`${decision} Appointment`} />
      <DialogContent>
        <Text style={{ fontSize: 20 }}>
          {decision} appointment for {date} at {time}?
        </Text>
        {decision === 'Reject' && (
          <View>
            <TextInput
              placeholder="Enter rejection reason"
              value={message}
              onChangeText={setMessage}
              style={{
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 5,
                padding: 8,
                marginTop: 10,
              }}
            />
          </View>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          title="Cancel"
          compact
          variant="text"
          onPress={() => setVisible(false)}
        />
        <Button
          title={decision}
          compact
          variant="text"
          onPress={handleAction}
        />
      </DialogActions>
    </Dialog>
  );
};

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

        const currentTime = new Date();

    await Promise.all(
      appointmentsSnapshot.docs.map(async doc => {
        const appointmentData = doc.data();
        const creationTimestamp = appointmentData.date.toDate(); // Assuming 'createdAt' is the timestamp field when the appointment request was created

        // Calculate the difference in milliseconds between the current time and the creation time
        const differenceInTime = currentTime.getTime() - creationTimestamp.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convert milliseconds to days

        // If the difference is more than 3 days and the appointment hasn't been approved, delete it
        if (differenceInDays > 3) {

          const appointmentRef = firestore().collection('appointments').doc(doc.id);
            
          appointmentRef.update({
              status: 2,
              message: 'Request automatically rejected'
            });

          console.log('Appointment request automatically rejected:', doc.id);
        }
      })
    );

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
      <ScrollView style={styles.container}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 28 }}>
          <Text style={{ fontSize: 32, color: 'black', fontWeight: 'bold', flex: 1 }}>Notifications</Text>
        </View>
        <View id="services">
          {userData.role === 1 ? (
            <>
              <Text style={[styles.notifHeader, { color: 'black' }]}>Appointment Requests</Text>
              <View style={{ marginBottom: 12 }}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#CEDDF7" style={{ marginTop: 60 }} />
                ) : (
                  apptReqList.map((item, index) => (
                    <Notification
                      key={index}
                      item={item}
                      fetchApptRequest={fetchApptRequest}
                    />
                  ))
                )}
                {apptReqList.length === 0 && (
                  <View>
                    <Text>No appointments available</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.notifHeader, { color: 'black' }]}>Recent Assessments</Text>
              <View style={{ marginBottom: 12 }}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#CEDDF7" style={{ marginTop: 60 }} />
                ) : (
                  assessmentList.map((item, index) => (
                    <Assessments key={index} item={item} />
                  ))
                )}
                {assessmentList.length === 0 && (
                  <View>
                    <Text>No new assessments</Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.notifHeader, { color: 'black' }]}>Appointments</Text>
              <View>
                <AppointmentList />
              </View>
              <Text style={[styles.notifHeader, { color: 'black' }]}>Assessments</Text>
              <View>
                <AssessmentList />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: '100%',
    padding: 20,
  },

  notifHeader: {
    fontSize: 20,
    fontWeight:'bold',
    marginBottom: 10
  }
});

export default Notifications;
