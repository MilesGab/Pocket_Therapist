import React from 'react';
import { View, Text, Image } from 'react-native';
import SensorFusionProvider, { useSensorFusion, toDegrees } from 'react-native-sensor-fusion';
import Instructions from '../../../assets/images/instructions.png';
import { Button } from '@react-native-material/core';
import { useNavigation } from "@react-navigation/native";

const WristAngleSensor = (props) =>{
  const { ahrs } = useSensorFusion();
  const { pitch} = ahrs.getEulerAngles();
  const [maxAngle, setMaxAngle] = React.useState(0);
  const [countdown, setCountdown] = React.useState(10);

  const navigation = useNavigation();


  React.useEffect(() => {
    let countdownInterval;

    if (countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
        if (toDegrees(pitch) > maxAngle) {
          setMaxAngle(toDegrees(pitch));
        }
      }, 1000);
    } else {
      clearInterval(countdownInterval);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [countdown]);

  const handleNext = () =>{
    navigation.navigate('Results', { maxAngle });
  };

  return(
    <View>

      <View style={styles.circle}>
        <View>
          <Text style={{textAlign: 'center'}}>
            Wrist: {toDegrees(pitch)}°
          </Text>
        </View>
      </View>

      <View>
        {countdown > 0 ? (
          <Text style={{ textAlign: 'center' }}>{countdown} seconds remaining</Text>
        ) : (
          <>
            <Text style={{ textAlign: 'center' }}>Wrist assessment complete</Text>
            <Button onPress={handleNext} title="Next"/>
          </>
        )}
      </View>
      <Button onPress={()=>setCountdown(10)} title="Start"/>

    </View>
  )

}

const JointAssessment = () => {

  const [isReady, setIsReady] = React.useState(false);
  const [angleData, setAngleData] = React.useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{fontSize: 32, fontWeight:'bold', color:'black'}}>Wrist Assessment</Text>
      </View>
      <View style={styles.content}>
        {isReady ? (<WristAngleSensor setAngleData={setAngleData}/>) : ( 
          <>
            <Image style={styles.instructionImage} source={Instructions}/>
            <Text style={styles.instructions}>Please hold your phone in a 90° angle and press start whenever ready</Text>
            <Button onPress={()=>{setIsReady(true)}} title="Ready" />
          </>
         )}
      </View>
    </View>
  );
};

const circleSize = 200;

const styles = {

  container: {
    display:'flex',
    width:'100%',
    height:'100%',
    padding: 10
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
  },

}

export default () => (
  <SensorFusionProvider>
    <JointAssessment />
  </SensorFusionProvider>
);
