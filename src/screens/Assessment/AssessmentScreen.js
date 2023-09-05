import { Button } from '@react-native-material/core';
import React from 'react';
import { View, Text } from 'react-native';
import SensorFusionProvider, { useSensorFusion, useCompass, toDegrees } from 'react-native-sensor-fusion';

const AssessmentScreen = ({ navigation }) => {
  const { ahrs } = useSensorFusion();
  const { heading, pitch, roll } = ahrs.getEulerAngles();
  const compass = useCompass();
  const [wristAngle, setWristAngle] = React.useState();

  const onSave = () => {
    setWristAngle(toDegrees(pitch));
    console.log("SAVED!");
  }

  return (
    <View style={{display:'flex', height:'100%'}}>
      <View style={{height:'100%',justifyContent:'center', alignContent:'center', alignItems:'center', backgroundColor:'#FEFEFE'}}>
        <Text>Please move your wrist</Text>
        <Text>
          Pitch: {toDegrees(pitch)}°
        </Text>
        <Button onPress={onSave} title="Save Angle" style={{marginBottom: 12}}/>
        <Button onPress={()=>{console.log(wristAngle)}} title="LOG" style={{marginBottom: 12}}/>
        <Button onPress={() => {navigation.navigate('MyTabs')}} title="GO HOME" style={{marginBottom: 12}}/>
      </View>
    </View>
  );
};

export default ({ navigation}) => (
  <SensorFusionProvider>
    <AssessmentScreen navigation={navigation} />
  </SensorFusionProvider>
);