import { Divider } from '@react-native-material/core';

import { useNavigation } from '@react-navigation/native';

import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';


const AssessmentCard = () => {

    return(
        <View style={styles.displayCard}>
            <Text style={{marginBottom: 6}}>{'October 5, 2023'}</Text>
            <Divider color='black'/>
            <View>
                <View>
                    <Text>Notes</Text>
                    <Text>•Discoloration is present</Text>
                    <Text>•Pain has been going on for the past few weeks</Text>
                </View>
                <View style={{display:'flex', justifyContent:'flex-end', alignContent:'flex-end', alignItems:'flex-end'}}>
                    <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}}>
                        <Text>View Assessment</Text>
                        <Icon name="arrow-forward-outline"  size={18}/>
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    )

}

const PatientAssessment = ({ route }) => {

    const { patientData } = route.params;
    const navigation = useNavigation();

    const handleList = () => {
        navigation.navigate('Exercises');
    }

    return(
        <View style={styles.container}>
            <View style={{marginBottom: 20}}>
                <Text style={{fontSize: 28, fontWeight:'bold'}}>Miles' Assessments</Text>
                <TouchableOpacity onPress={handleList} style={styles.videoContainer}>
                    <View style={{ borderRadius: 12, backgroundColor: 'white', padding: 10, flexDirection:'row', alignItems:'center' }}>
                        <Icon name="walk-outline" size={20}/>
                        <Text>Miles' exercise list</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <AssessmentCard/>
        </View>
    )

}

const styles = StyleSheet.create({

    container:{
        display:'flex',
        paddingTop: 32,
        padding: 12
    },

    displayCard:{
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 6
    },

    videoContainer:{
    }

})


export default PatientAssessment;