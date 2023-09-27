import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AssessmentScreen from './AssessmentScreen';
import Questionnaire from './Questionnaire';
import JointAssessment from './JointAssessment';
import Results from './Results';

const Stack = createStackNavigator();

const Assessment = () =>{

    const [maxAngleData, setMaxAngleData] = React.useState(0);
    const [phyiscalData, setPhysicalData] = React.useState([]);
    const [painData, setPainData] = React.useState([]);

    const updateMaxAngleData = (newValue) => {
        setMaxAngleData(newValue);
    };

    const updatePhysicalData = (newValue) => {
        setPhysicalData(newValue);
    };

    const updatePainData = (newValue) => {
        setPainData(newValue);
    };

    return(
        <Stack.Navigator initialRouteName={'AssessmentScreen'} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AssessmentScreen" component={AssessmentScreen} />
            <Stack.Screen name="Questionnaire">
                {(props) => (
                    <Questionnaire {...props} updatePainData={updatePainData} updatePhysicalData={updatePhysicalData} />
                )}
            </Stack.Screen>
            <Stack.Screen name="JointAssessment" component={JointAssessment} />
            <Stack.Screen name="Results">
                {(props) => (
                    <Results {...props} painData={painData} phyiscalData={phyiscalData} />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    )

};

export default Assessment;