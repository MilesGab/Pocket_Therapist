import { firebase } from '@react-native-firebase/auth';
import { ActivityIndicator, Divider } from '@react-native-material/core';

import { useNavigation } from '@react-navigation/native';

import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUserContext } from '../../../../contexts/UserContext';
import firestore from '@react-native-firebase/firestore';

const DiscolorationMap = {
    'NO' : 'No discoloration present',
    'YES' : 'Discoloration is present'
};
const SwellingMap = {
    'NO' : 'There is no swelling on the wrist',
    'YES' : 'There is swelling on the wrist'
};
const TemperatureMap = {
    'NO' : 'Wrist is not warm to the touch',
    'YES' : 'Wrist is warm to the touch'
};
const PainMap = {
    'NO' : 'There is no pain when pressure is applied',
    'YES' : 'Pain is present when pressure is applied'
};

const AssessmentCard = ( item ) => {

    const navigation = useNavigation();


    const timestamp = new Date(
        item.date.seconds * 1000 + item.date.nanoseconds / 1000000
    );
    
    const formattedDate = timestamp.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric' 
    });

    const handleViewAssessment = (id) => {
        navigation.navigate('AssessmentPage', {patientData: item})
    };

    return(
        <View style={styles.displayCard}>
            <Text style={{marginBottom: 6, color:'white'}}>{formattedDate}</Text>
            <Divider color='white'/>
            <View>
                <View style={{marginBottom:12}}>
                    <Text style={[styles.cardText, {fontWeight:'bold'}]}>Notes</Text>
                    <Text style={styles.cardText}>Physical Data</Text>
                    <Text style={styles.cardText}>•{DiscolorationMap[item.phyiscalData[0]]}</Text>
                    <Text style={styles.cardText}>•{SwellingMap[item.phyiscalData[1]]}</Text>
                    <Text style={styles.cardText}>•{TemperatureMap[item.phyiscalData[2]]}</Text>
                    <Text style={styles.cardText}>•{PainMap[item.phyiscalData[3]]}</Text>
                </View>
                <View style={{display:'flex', justifyContent:'flex-end', alignContent:'flex-end', alignItems:'flex-end'}}>
                    <TouchableOpacity onPress={()=>handleViewAssessment(item.uid)} style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.cardText}>View Assessment</Text>
                        <Icon name="arrow-forward-outline" color={'white'} size={18}/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      
    );

};

const PatientAssessment = ({ route }) => {

    const { patientData } = route.params;
    const navigation = useNavigation();

    const handleList = () => {
        navigation.navigate('Exercises');
    }

    const { userData, updateUser } = useUserContext();
    const trimmedUid = patientData?.trim();
    const [assessmentList, setAssessmentList] = React.useState([]);
    const [patientInfo, setPatientInfo] = React.useState([]);

    const [isLoading, setLoading] = React.useState(true);

    const fetchPatientData = async () => {
        try{

            const querySnapshot = await firestore()
            .collection("users")
            .where("uid", "==", trimmedUid)
            .get();

            const queryData = querySnapshot.docs[0].data();

            setPatientInfo(queryData);
        }
        catch (error) {
            console.error('Error fetching patient results: ', error);
        }
    };

    const fetchPatientResults = async () => {
        try {
            const querySnapshot = await firestore()
            .collection("assessments")
            .where("patient", "==", trimmedUid)
            .get();

            const assessments = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                assessments.push(data);
            });

            setAssessmentList(assessments);

        } catch (error) {
            console.error('Error fetching assessments: ', error);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(()=>{
        fetchPatientData();
    }, []);

    React.useEffect(()=>{
        fetchPatientResults();
    }, []);

    return(
        <ScrollView>
            <View style={styles.container}>
                <View style={{marginBottom: 20}}>
                    <Text style={{fontSize: 28, fontWeight:'bold', color:'black'}}>{patientInfo.firstName}'s Assessments</Text>
                    <TouchableOpacity onPress={handleList} style={styles.videoContainer}>
                        <View style={styles.buttonWrapper}>
                            <Icon name="walk-outline" size={20} color='black'/>
                            <Text style={{color:'black'}}>{patientInfo.firstName}'s exercise list</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {isLoading ? (
                    <ActivityIndicator size={'large'} color='gray'/>
                ) : (
                    <FlatList
                    horizontal={false}
                    data={assessmentList}
                    keyExtractor={(item) => item.uid}
                    renderItem={({ item }) => (
                        <AssessmentCard {...item} />
                    )}
                    showsVerticalScrollIndicator={false} 
                    scrollEnabled={false}
                    />
                )}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    container:{
        display:'flex',
        paddingTop: 32,
        padding: 12
    },

    displayCard:{
        backgroundColor: '#65A89F',
        padding: 12,
        borderRadius: 20,
        marginBottom: 12,
    },
    
    cardText: {
        color:'white',
        fontSize: 16
    },

    buttonWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: 'white',
        padding: 10,
    },

    videoContainer:{
        display:'flex',
        width: 'auto',
    }

})


export default PatientAssessment;