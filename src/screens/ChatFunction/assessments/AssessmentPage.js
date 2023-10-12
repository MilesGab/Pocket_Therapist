import React from 'react';
import { Avatar } from '@react-native-material/core';
import { View, Text, StyleSheet } from 'react-native';

import Slider from "@react-native-community/slider";
import { ScrollView } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';


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

const AssessmentPage = ({ route }) => {

    const { patientData } = route.params;


    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.patientInfoContainer}>
                    <Avatar label={'Hanni Pham'} />
                    <View style={{marginLeft:12, color:'white'}}>
                        <Text style={{color:'white'}}>Hanni Pham</Text>
                        <Text style={{color:'white'}}>Patient</Text>
                        <Text style={{color:'white'}}>Assessment Taken: October 10, 2023</Text>
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
                </View>
            </View>
        </ScrollView>
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