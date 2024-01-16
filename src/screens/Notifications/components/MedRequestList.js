import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useUserContext } from '../../../../contexts/UserContext';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { Text } from 'react-native-paper';


const TypeMap = {
    'medical_certificate' : 'Medical Certificate',
    'laboratory_request' : 'Laboratory Request',
    'medical_prescription' : 'Medical Prescription'
}

const AssessmentCard = ({ type, status }) => {
    const cardStyle = {
        ...styles.notifCard,
        backgroundColor: status === 'rejected' ? '#f57f7f' : '#ace5ee' // Red if rejected, otherwise light blue
    };

    return (
        <View style={cardStyle}>
            <View style={styles.content}>
                {status === 'complete' ? <Icon style={{ fontSize: 50, color: '#002147' }} name="checkmark-circle" /> : <Icon style={{ fontSize: 50, color: '#002147' }} name="close-circle" />}
                <Text style={styles.contentText}>Your request for {TypeMap[type]} has been {status}</Text>
            </View>
        </View>
    );
};

  
const MedDocList = () =>{

    const { userData } = useUserContext();
    const trimmedUid = userData?.uid.trim();
    const [reqList, setReqList] = React.useState([]);

    React.useEffect(() => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Set the date to 7 days ago
    
        const unsubscribe = firestore()
            .collection('medDocuRequest')
            .where('patient', '==', trimmedUid)
            .where('createdAt', '>=', oneWeekAgo)
            .where('status', 'in', ['complete', 'rejected']) 
            .onSnapshot(snapshot => {
                const requests = [];
                snapshot.forEach(doc => {
                    requests.push(doc.data());
                });
                setReqList(requests);
            }, error => {
                console.error("Error fetching documents: ", error);
            });
    
        return () => unsubscribe();
    }, []);

    return(
        <View>
            {reqList.map((item, index) => (
            <AssessmentCard key={index} type={item.type} status={item.status}/>
            ))}
        </View>
    )

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

export default MedDocList;