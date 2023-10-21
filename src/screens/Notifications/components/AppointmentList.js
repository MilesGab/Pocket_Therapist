import { Avatar } from '@react-native-material/core';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUserContext } from '../../../../contexts/UserContext';
import firestore from '@react-native-firebase/firestore';

const AppointmentCard = ({ doctor, date }) => {

  const timestamp = new Date(
    date.seconds * 1000 + date.nanoseconds / 1000000
  );

  const formattedDate = timestamp.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric' 
  });
  
    return(
        <View style={styles.notifCard}>
            <View style={styles.content}>
            <Icon style={{fontSize:50, color:'#002147'}} name="id-card"/>
                <Text style={styles.contentText}>Your appointment for {formattedDate} has been approved by Dr. {doctor?.firstName || '---'} {doctor?.lastName || '---'}</Text>
            </View>
        </View>
    )
    
}

const AppointmentList = () => {

    const { userData } = useUserContext();
    const doctorId = userData.doctor;
    const trimmedUid = userData.uid.trim();

    const [doctor, setDoctor] = React.useState({});
    const [appointmentList, setAppointmentList] = React.useState([]);

    const fetchDoctor = async () => {
        try {
          const querySnapshot = await firestore()
            .collection('users')
            .where('uid', '==', doctorId)
            .get();
    
          if (!querySnapshot.empty) {
            const doctorDoc = querySnapshot.docs[0];
            const doctor = doctorDoc.data();
            setDoctor(doctor);
          } else {
            console.log('No doctor found with the provided ID.');
          }
        } catch (error) {
          console.error('Error fetching doctor: ', error);
        }
      };

    React.useEffect(()=>{
        fetchDoctor();
    }, []);

    const fetchApprovedAssessments = async () => {

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        try{
          const assessmentQuerySnapshot = await firestore()
            .collection('appointments')
            .where('patient_assigned', '==', trimmedUid)
            .where('date', '>=', oneWeekAgo)
            .where('status', '==', 1)
            .orderBy('date', 'desc')
            .get()
    
          const assessments = [];
          assessmentQuerySnapshot.forEach((doc) => {
            const assessmentData = doc.data();
            assessments.push(assessmentData);
          });

          setAppointmentList(assessments);  
          console.log(assessments);  
        } catch (error) {
          console.error('Failed to fetch approved appointments: ', error);
        }
      }

      React.useEffect(()=>{
        fetchApprovedAssessments();
      },[])

      return (
        <View>
          {appointmentList.map((item, index) => (
            <AppointmentCard key={index} doctor={doctor} date={item.date}/>
          ))}
        </View>
      );

}

const styles = StyleSheet.create({
    notifCard: {
        backgroundColor: '#aaf0d1',
        borderRadius: 12,
        padding: 18,
        marginBottom:12,
        height:'auto'
    },

    content: {
        width:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'top'
    },
    
    contentText: {
        width: '80%',
        fontStyle: 'normal',
        fontSize: 16,
        marginHorizontal: 12,
        color:'black'
    }
})

export default AppointmentList;