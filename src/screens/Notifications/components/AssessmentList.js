import { Avatar } from '@react-native-material/core';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUserContext } from '../../../../contexts/UserContext';
import firestore from '@react-native-firebase/firestore';

const AssessmentCard = ({ doctor, date }) => {

  const timestamp = new Date(
    date.seconds * 1000 + date.nanoseconds / 1000000
  );

  const formattedDate = timestamp.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric' 
  });
  
    return(
        <View style={styles.notifCard}>
            <View style={styles.content}>
            <Icon style={{fontSize:50, color:'#002147'}} name="checkmark-circle"/>
                <Text style={styles.contentText}>Your assessment last {formattedDate} has been reviewed by Dr. {doctor?.firstName || '---'} {doctor?.lastName || '---'}</Text>
            </View>
        </View>
    )
    
}

const AssessmentList = () => {

    const { userData } = useUserContext();
    const doctorId = userData.doctor;
    const trimmedUid = userData.uid.trim();

    const [doctor, setDoctor] = React.useState({});
    const [assessmentList, setAssessmentList] = React.useState([]);

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

    const fetchApprovedAssessments = () => {
      try {
        const unsubscribe = firestore()
          .collection('assessments')
          .where('patient', '==', trimmedUid)
          .where('status', '==', 'reviewed')
          .limit(5)
          .onSnapshot(snapshot => {
            const assessments = [];
            snapshot.forEach(doc => {
              assessments.push(doc.data());
            });
    
            setAssessmentList(assessments);
            console.log(assessments);
          }, error => {
            console.error('Failed to fetch approved assessments: ', error);
          });
    
        return unsubscribe;
      } catch (error) {
        console.error('Failed to set up onSnapshot listener: ', error);
      }
    };

    React.useEffect(()=>{
      fetchApprovedAssessments();
    },[])

    React.useEffect(() => {
      const unsubscribe = fetchApprovedAssessments();
    
      // Cleanup function
      return () => {
        unsubscribe();
      };
    }, []);

    return (
      <View>
        {assessmentList.map((item, index) => (
          <AssessmentCard key={index} doctor={doctor} date={item.date}/>
        ))}
      </View>
    );

}

const styles = StyleSheet.create({
    notifCard: {
        backgroundColor: "#ace5ee",
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

export default AssessmentList;