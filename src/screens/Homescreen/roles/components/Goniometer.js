import React from 'react';
import { View, Text, Image } from 'react-native';
import SensorFusionProvider, { useSensorFusion, toDegrees } from 'react-native-sensor-fusion';
import { Button } from '@react-native-material/core';
import { useNavigation } from "@react-navigation/native";

const Goniometer = (props) =>{
  const { ahrs } = useSensorFusion();
  const { pitch} = ahrs.getEulerAngles();
  const [maxAngle, setMaxAngle] = React.useState(0);
  const [countdown, setCountdown] = React.useState(10);

  const navigation = useNavigation();


  return(
    <View style={styles.container}>
      <View style={styles.circle}>
        <View>
          <Text style={{textAlign: 'center', color:'black'}}>
            Wrist: {toDegrees(Math.abs(pitch).toFixed(1))}°
          </Text>
        </View>
      </View>
    </View>
  )

}

const circleSize = 200;

const styles = {

  container: {
    display:'flex',
    width:'100%',
    height:'100%',
    padding: 10,
    alignItems:'center',
    justifyContent:'center'
  },

  header: {
    width:'100%',
    padding: 4,
    marginBottom: 180
  },

  content: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
  },

  instructionImage: {
    width: 200,
    height: 200,
    marginBottom: 4
  },

  instructions: {
    textAlign:'center',
    fontSize: 16
  },

  circle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    borderColor: 'black', // You can change the border color to your preference.
    borderWidth: 4, // You can adjust the border width.
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },

}

export default () => (
  <SensorFusionProvider>
    <Goniometer />
  </SensorFusionProvider>
);
