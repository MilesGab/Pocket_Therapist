import { Avatar } from '@react-native-material/core';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUserContext } from '../../../../contexts/UserContext';
import firestore from '@react-native-firebase/firestore';

const AppointmentCard = ({ doctor, date, status, message }) => {
  const timestamp = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
  const formattedDate = timestamp.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = timestamp.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  let cardBackgroundColor = '#FFFFFF'; // Default background color

  let messages = '';

  switch (status) {
    case 0:
      cardBackgroundColor = '#FFE5CC'; // Pale orange color
      messages = `Your appointment on ${formattedDate} at ${formattedTime} is pending approval.`;
      break;
    case 1:
      cardBackgroundColor = '#C8E6C9'; // Light green color
      messages = `Your appointment on ${formattedDate} at ${formattedTime} has been approved by Dr. ${doctor?.firstName || '---'} ${doctor?.lastName || '---'}.`;
      break;
    case 2:
      cardBackgroundColor = '#FFEBEE'; // Light red color
      messages = `Your appointment on ${formattedDate} at ${formattedTime} has been rejected by Dr. ${doctor?.firstName || '---'} ${doctor?.lastName || '---'}. \n\nReason: ${message || 'No reason provided'}`;
      break;
    default:
      messages = 'Unknown status';
      break;
  }

  return (
    <View style={[styles.notifCard, { backgroundColor: cardBackgroundColor }]}>
      <View style={styles.content}>
        <Avatar size={60} image={{ uri: doctor.profilePictureURL }} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.contentText}>{messages}</Text>
      </View>
    </View>
  );
};

const AppointmentList = () => {

    const { userData } = useUserContext();
    const doctorId = userData.doctor;
    const trimmedUid = userData.uid.trim();

    const [doctor, setDoctor] = React.useState({});
    const [appointments, setAppointments] = React.useState([]);

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

    const fetchAppointments = async () => {
      try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
        const appointmentQuerySnapshot = await firestore()
          .collection('appointments')
          .where('patient_assigned', '==', trimmedUid)
          .where('date', '>=', oneWeekAgo)
          .orderBy('date', 'desc')
          .limit(5)
          .get();
    
        const appointmentsData = [];
        appointmentQuerySnapshot.forEach((doc) => {
          const appointmentData = doc.data();
          appointmentsData.push({
            ...appointmentData,
            id: doc.id, // Adding the document ID for reference if needed
          });
        });
    
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Failed to fetch appointments: ', error);
      }
    };
  
    React.useEffect(() => {
      fetchDoctor();
      fetchAppointments();
    }, []);
      return (
        <View>
        {appointments.map((item, index) => (
          <AppointmentCard key={index} doctor={doctor} date={item.date} status={item.status} message = {item.message} />
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