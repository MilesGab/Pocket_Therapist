import React from 'react';
import { Avatar, Button, Dialog, DialogContent, DialogHeader, Provider, TextInput } from '@react-native-material/core';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Slider from "@react-native-community/slider";
import { ScrollView } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';


const PhysicalQuestions = [
    'Is there discoloration on the wrist?',
    'Is there swelling on the wrist?',
    'Is the wrist warm to touch? (Warmer than usual)',
    'Are you experiencing any kind of pain when you touch or apply pressure to your wrist?',
];

const PainQuestions = [
    'Describe the pain based on the choices provided',
    'How long have you been experiencing pain on your wrist?',
    'Maximum range of motion: '
];

const PhysicalDataResults = ({ question, answer }) => {

    return(
        <View style={{backgroundColor:'#477674', padding: 12, borderRadius: 12, marginBottom: 12}}>
            <Text style={{color:'white', fontSize: 18}}>{question}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
                    {answer}
                </Text>
            </View>
        </View>
    )

}

const VASScoreDisplay = () => {

    const [sliderValue, setSliderValue] = React.useState(2);

    return (
        <View style={{backgroundColor:'#477674', padding: 12, borderRadius: 12, marginBottom: 12}}>
            <Text style={{color:'white', fontSize: 18}}>VAS Score</Text>
            <View>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    minimumTrackTintColor="white"
                    maximumTrackTintColor="white"
                    thumbTintColor="white"
                    value={sliderValue}
                    disabled
                />
                <View style={styles.sliderScale}>
                  {Array.from({ length: 11 }, (_, i) => (
                    <Text style={{color:'white', fontSize: 18}} key={i}>{i}</Text>
                  ))}
                </View>
            </View>
        </View>
    )

}

const NoteDialog = (props) => {
    const [diagnosis, setDiagnosis] = React.useState('');
    const [notes, setNotes] = React.useState('');
    const assessmentId = props?.assessmentId;

    const handleDiagnosisChange = (text) => {
        setDiagnosis(text);
    }

    const handleNotesChange = (text) => {
        setNotes(text);
    }

    const handleSave = async () => {
        try {
            const assessmentsRef = firestore().collection('assessments').doc(assessmentId);

            await assessmentsRef.update({
                diagnosis: diagnosis,
                notes: notes
            });
        } catch (error) {
            console.error('Failed to save assessment notes: ', error);
        } finally {
            console.log('SAVED!');
            props?.setVisible(false);
        }
    }

    return (
        <Dialog visible={props?.visible} onDismiss={() => props?.setVisible(false)}>
            <DialogHeader title="Review Assessment" />
            <DialogContent>
                <View style={{ gap: 12 }}>
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text>Diagnosis</Text>
                        <TextInput
                            value={diagnosis}
                            onChangeText={handleDiagnosisChange}
                        />
                    </View>
                    <View>
                        <Text>Notes</Text>
                        <TextInput
                            value={notes}
                            onChangeText={handleNotesChange}
                        />
                    </View>
                    <View>
                        <Button onPress={handleSave} color={'lightgray'} title={'Save'} />
                    </View>
                </View>
            </DialogContent>
        </Dialog>
    )
}

const AssessmentPage = ({ route }) => {

    const { patientData } = route.params;
    const [patientInfo, setPatientInfo] = React.useState([]);
    const [visible, setVisible] = React.useState(false);

    const trimmedUid = patientData?.patient.trim();
    const assessmentId = patientData?.uid;

    React.useEffect(()=>{
        fetchPatientData();
        console.log(trimmedUid);
    },[]);

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

    const timestamp = new Date(
        patientData?.date.seconds * 1000 + patientData?.date.nanoseconds / 1000000
      );

    const formattedDate = timestamp.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric' 
      });

    return (
        <Provider>
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.patientInfoContainer}>
                    <Avatar image={{uri: patientInfo?.profilePictureURL}} />
                    <View style={{marginLeft:12, color:'white'}}>
                        <Text style={{color:'white'}}>{patientInfo?.firstName} {patientInfo?.lastName}</Text>
                        <Text style={{color:'white'}}>Patient</Text>
                        <Text style={{color:'white'}}>Assessment Taken: {formattedDate}</Text>
                    </View>
                </View>
                <View>
                    <Text style={{color:'white', fontSize: 20, fontWeight:'bold', marginBottom: 12}}>Physical Inspection</Text>
                    <View style={{paddingHorizontal: 12}}>
                        {PhysicalQuestions.map((question, index) => (
                            <PhysicalDataResults key={index} question={question} answer={patientData.phyiscalData[index]}/>
                        ))}
                    </View>
                    <Text style={{color:'white', fontSize: 20, fontWeight:'bold', marginBottom: 12}}>Pain Assessment</Text>
                        <View style={{paddingHorizontal: 12}}>
                            <VASScoreDisplay/>
                            {PainQuestions.map((question, index) => (
                            <PhysicalDataResults
                                key={index}
                                question={question}
                                answer={
                                patientData.painData[index + 1]
                                ? patientData.painData[index + 1]
                                : patientData.maxAngle
                                }
                            />
                            ))}
                        </View>
                        <TouchableOpacity onPress={()=>{setVisible(true)}} style={{backgroundColor: 'white', justifyContent:'center', alignContent:'center', alignItems:'center', padding: 12, borderRadius: 12}}>
                            <Text style={{color:'black'}}>Notes and diagnosis</Text>
                        </TouchableOpacity> 
                        <NoteDialog visible={visible} setVisible={setVisible} assessmentId={assessmentId}/>
                </View>
            </View>
        </ScrollView>
        </Provider>
    )

}

const styles = StyleSheet.create({

    container:{
        display:'flex',
        paddingTop: 32,
        padding: 12,
        height:'100%',
        backgroundColor: '#65A89F'
    },

    patientInfoContainer:{
        display:'flex',
        flexDirection:'row',
        marginBottom: 20
    },

    slider: {
        width: '100%', // Adjust the width of the slider
        marginLeft: 3
      },

    sliderScale: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
    },

})

export default AssessmentPage;