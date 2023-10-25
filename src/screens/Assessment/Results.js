import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Box, Button } from '@react-native-material/core';
import { useNavigation } from "@react-navigation/native";
import { useUserContext } from '../../../contexts/UserContext';
import firestore from '@react-native-firebase/firestore';


const questions = [
    'Is there discoloration on the wrist?',
    'Is there swelling on the wrist?',
    'Is the wrist warm to touch?',
    'Are you experiencing any kind of pain?',
];

const painAssessmentQuestions = [
    'VAS Score',
    'Pain',
    'Duration of Pain',
  ];

const Results = ({ painData, phyiscalData }) => {
    const { userData, updateUser } = useUserContext();
    const navigation = useNavigation();
    const route = useRoute();
    const maxAngle  = route.params?.maxAngle;

    const storeResults = async () => {
        const trimmedUid = userData.uid.trim();
  
        try {
          const appointmentRef = await firestore().collection('assessments').add({
            date: new Date(),
            patient: trimmedUid,
            painData,
            phyiscalData,
            maxAngle
          });
  
          const generatedUID = appointmentRef.id;
          await appointmentRef.update({ uid: generatedUID });
  
        } catch (error) {
          console.error('Failed to create appointment: ', error);
        }
      };
  

    const handleSave = () => {
        storeResults();
        navigation.navigate('MyTabs');
    }

    const handleReturn = () => {
        navigation.navigate('AssessmentScreen')
    }

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{fontSize:32, color:'black', fontWeight:'bold', marginBottom: 12}}>Results</Text>
            </View>

            <Box style={{ backgroundColor: '#65A89F', borderRadius: 20, marginBottom: 12 }}>
            <View style={styles.physicalResults}>
                <Text style={{fontWeight:'bold',color:'white'}} >Physical Assessment</Text>
                {questions.map((question, index) => (
                    <Text style={{color:'white', fontSize: 16}} key={question}>
                        {question} {phyiscalData[index] || '---'}
                    </Text>
                ))}
            </View>
            </Box>
            <Box style={{ backgroundColor: '#65A89F', borderRadius: 20, marginBottom: 12 }}>
            <View style={styles.painResults}>
                <Text style={{fontWeight:'bold',color:'white'}}>Pain Assessment</Text>
                {painAssessmentQuestions.map((question, index) => (
                    <Text style={{color:'white', fontSize: 16}} key={question}>
                        {question}: {painData[index] || '---'}
                    </Text>
                ))}
            </View>
            </Box>

            <Box style={{ backgroundColor: '#65A89F', borderRadius: 20, marginBottom: 20 }}>
            <View style={styles.wristResults}>
                <Text style={{fontWeight:'bold',color:'white'}} >Range of Motion Assessment</Text>
                <Text style={{color:'white', fontSize: 16}} >Max wrist flexion: {maxAngle?.toFixed(3) || '---'} </Text>
            </View>
            </Box>

            <View style={styles.decisionButtons}>
                <Button color={'white'} onPress={handleReturn} title="Retake Assessment"/>
                <Button color={'white'} onPress={handleSave} title="Confirm Results"/>
            </View>
        </View>
    )

}

const styles = {

    container: {
        display:'flex',
        padding: 10,
    },

    header: {
        marginBottom: 10
    },

    decisionButtons: {
        display:'flex',
        flexDirection:'row',
        gap: 8
    },

    physicalResults: {
        marginVertical: 10,
        marginHorizontal:14,
        display: 'flex'
    },

    painResults: {
        marginVertical: 10,
        marginHorizontal:14,
        display: 'flex'
    },

    wristResults:{
        marginVertical: 10,
        marginHorizontal:14,
        display: 'flex'
    }

}

export default Results;