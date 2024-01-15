import React, { useState, useEffect } from 'react';
import { Avatar, Button, Dialog, DialogContent, DialogHeader, Provider, TextInput } from '@react-native-material/core';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';

import Slider from "@react-native-community/slider";
import { ScrollView } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import ImageViewer from 'react-native-image-zoom-viewer';


const PhysicalQuestions = [
    'Is there discoloration on the wrist?',
    'Is there swelling on the wrist?',
    'Is the wrist warm to touch? (Warmer than usual)',
    'Are you experiencing any kind of pain when you touch or apply pressure to your wrist?',
];

const PainQuestions = [
    'Describe the pain based on the choices provided',
    'How long have you been experiencing pain on your wrist?',
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
    const [initialDiagnosis, setInitialDiagnosis] = useState('');
    const [initialNotes, setInitialNotes] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
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

            console.log('SAVED!');
            props?.setVisible(false);
        } catch (error) {
            console.error('Failed to save assessment notes: ', error);
        }
    }

    const handleCancel = () => {
        // Reset state to initial values
        setDiagnosis(initialDiagnosis);
        setNotes(initialNotes);
        props?.setVisible(false);
    }

    useEffect(() => {
        const fetchAssessmentData = async () => {
            try {
                const assessmentsRef = firestore().collection('assessments').doc(assessmentId);
                const snapshot = await assessmentsRef.get();

                if (snapshot.exists) {
                    const data = snapshot.data();
                    setInitialDiagnosis(data.diagnosis || ''); // Populate initial diagnosis
                    setInitialNotes(data.notes || ''); // Populate initial notes
                    setDiagnosis(data.diagnosis || ''); // Populate diagnosis
                    setNotes(data.notes || ''); // Populate notes
                }
            } catch (error) {
                console.error('Error fetching assessment data: ', error);
            }
        };

        fetchAssessmentData();
    }, [assessmentId]);

    return (
        <Dialog visible={props?.visible} onDismiss={handleCancel}>
            <DialogHeader title="Review Assessment" />
            <DialogContent>
                <View style={{ gap: 12 }}>
                    <View style={{ display: 'flex', flexDirection: 'column' }}>
                        <Text>Diagnosis</Text>
                        <TextInput
                            value={diagnosis}
                            onChangeText={handleDiagnosisChange}
                            multiline={true}
                        />
                    </View>
                    <View>
                        <Text>Notes/Recommendations</Text>
                        <TextInput
                            value={notes}
                            onChangeText={handleNotesChange}
                            multiline={true}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button onPress={handleSave} color={'lightgray'} title={'Save'} />
                        <Button onPress={handleCancel} color={'lightgray'} title={'Cancel'} />
                    </View>
                </View>
            </DialogContent>
        </Dialog>
    );
};

const AssessmentPage = ({ route }) => {

    const { patientData } = route.params;
    const [patientInfo, setPatientInfo] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [isImageViewerVisible, setImageViewerVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
    const imagesForViewer = patientData.painData[3] ? [{ url: patientData.painData[3] }] : [];
  
    const openImageViewer = (index) => {
      setCurrentImageIndex(index);
      setImageViewerVisible(true);
    };  

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
                            <PhysicalDataResults
                                question={'Pain Description'}
                                answer={patientData.painData[4]}
                            />
                            <View style={{backgroundColor:'#477674', padding: 12, borderRadius: 12, marginBottom: 12}}>
                                <Text style={{color:'white', fontSize: 18}}>Image of Affected Area</Text>
                                <TouchableOpacity onPress={() => openImageViewer(0)} style={{ flexDirection: 'row', justifyContent:'center'}}>
                                    <Image source={{uri: patientData.painData[3]}} style={{width: 150, height: 150}}/>
                                </TouchableOpacity>
                            </View>
                            <PhysicalDataResults
                                question={'Maximum Range of Motion'}
                                answer={patientData.maxAngle}
                            />
                        </View>
                        <TouchableOpacity onPress={()=>{setVisible(true)}} style={{backgroundColor: 'white', justifyContent:'center', alignContent:'center', alignItems:'center', padding: 12, borderRadius: 12}}>
                            <Text style={{color:'black'}}>Notes and diagnosis</Text>
                        </TouchableOpacity> 
                        <NoteDialog visible={visible} setVisible={setVisible} assessmentId={assessmentId}/>
                </View>
            </View>
            <Modal 
                visible={isImageViewerVisible} 
                transparent={true}
                onRequestClose={() => {
                setImageViewerVisible(false)
                }}
            >
                <ImageViewer 
                imageUrls={imagesForViewer}
                index={currentImageIndex}
                onSwipeDown={() => setImageViewerVisible(false)}
                enableSwipeDown={true}
                />
            </Modal>
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