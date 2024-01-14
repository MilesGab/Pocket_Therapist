import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image, PermissionsAndroid, TouchableHighlight, TextInput} from "react-native";
import { ProgressBar } from "react-native-paper";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from "@react-native-community/slider";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import firestore from '@react-native-firebase/firestore';

import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { useUserContext } from '../../../../contexts/UserContext';


const Questionnaire = ({ updatePainData, updatePhysicalData }) => {
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [painAnswers, setPainAnswers] = useState(Array(questions.length).fill(''));
  const [sliderValue, setSliderValue] = useState(0);
  const [isPainAssessment, setIsPainAssessment] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [dropDownValue, setDropDownValue] = useState('');
  const [imageLibrary, setImageLibrary] = useState(null)
  const [imageCamera, setImageCamera] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);
  const [tempURI, setTempURI] = useState(null);

  const [dropDownItems, setDropDownItems] = useState([
    { value: 'Sharp', label: 'Sharp: Sudden, intense, and localized pain sensation.' },
    { value: 'Dull', label: 'Dull: Aching or throbbing pain that is not sharp or intense.' },
    { value: 'Stabbing', label: 'Stabbing: Brief, piercing pain.' },
    { value: 'Shooting', label: 'Shooting: Pain that radiates or shoots along the wrist or into the hand.' },
    { value: 'Burning', label: 'Burning: Sensation of heat or burning in the wrist.' },
    { value: 'Tingling', label: 'Tingling: Prickling or "pins and needles" sensation.' },
    { value: 'Stiff', label: 'Stiff: Pain accompanied by a sensation of stiffness or reduced range of motion.' },
    { value: 'Numb', label: 'Numb: Partial or complete loss of sensation in the wrist area.' },
    { value: 'Cramping', label: 'Cramping: Pain with a constricting or tightening sensation in the wrist.' },
    { value: 'Sore', label: 'Sore: Tenderness or discomfort in the wrist, often associated with overuse or strain.' },
    { value: 'Others', label: 'Others'}
  ]);
  const [painDuration, setPainDuration] = useState('');

  const painDurationItems = [
    {value:'Few Days', label: 'Few Days'},
    {value:'Few Weeks', label: 'Few Weeks'},
    {value:'Few Months', label: 'Few Months'},
    {value:'Several Months', label: 'Several Months'},
    {value:'Years', label: 'Years'},
  ];

  const [currentPainQuestion, setCurrentPainQuestion] = useState(0);

  const handleNextQuestion = (answers) => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      
      const updatedAnswers = [...painAnswers];
      updatedAnswers[currentQuestion] = answers;
      setPainAnswers(updatedAnswers);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNextPainQuestion = () => {
    if (currentPainQuestion < painAssessmentQuestions.length - 1) {
      setCurrentPainQuestion(currentPainQuestion + 1);
    }
  };

  const handlePreviousPainQuestion = () => {
    if (currentPainQuestion > 0) {
      setCurrentPainQuestion(currentPainQuestion - 1);
    }
  };

  const pickImage = async () => {
    let result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1, //adjust values after testing in real device
      maxWidth: 1920,
      maxHeight: 1800,
    });

    if (!result.didCancel){
      setImageLibrary(result.assets[0].uri);
      console.log('image selected from library');
    }
  };

  const captureImage = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED){
      let result = await launchCamera({
        mediaType: 'photo',
        quality: 0.5,//adjust values after testing in real device
        maxWidth: 1000,
        maxHeight: 1000,
      });
      setImageCamera(result.assets[0].uri);
      console.log('image captured from camera');
    }
  };

  const uploadUserAssessmentPics = async () => {
    try{
        let imageURL = imageCamera || imageLibrary; 

      if (imageURL) {
        const filename = imageURL.substring(imageURL.lastIndexOf('/') + 1);
        const assessmentsRef = storage().ref(`userAssessment/${filename}`);
        const response = await fetch(imageURL);
        const blob = await response.blob();
        await assessmentsRef.put(blob);

        const downloadURL = await assessmentsRef.getDownloadURL();
        setDownloadURL(downloadURL);
        
        console.log('Image on hold for upload');

      } else {
        alert('There is an error while saving, please try again');
      }
    }catch (error){
      console.log('Error uploading image')
    }
  };
  
  const unselectImage = () => {
    setImageCamera(null);
    setImageLibrary(null);
    console.log('image removed');
  };

  const progress = isPainAssessment
    ? ((currentPainQuestion + 1) / painAssessmentQuestions.length) * 100
    : ((currentQuestion + 1) / questions.length) * 100;

  const handleSensorPage = () => {
    updatePainData([sliderValue, dropDownValue, painDuration, downloadURL]);
    updatePhysicalData(painAnswers);
    navigation.navigate('JointAssessment');
  }

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Assessment</Text>
      <Text style={isPainAssessment ? styles.titlePortion : styles.titlePortion}>
        {isPainAssessment ? 'Pain Assessment' : 'Physical Inspection'}
      </Text>

      <View style={styles.top}>
        <ProgressBar progress={progress / 100} color="#65A89F" />

        {isPainAssessment ? (
          <View>
            <Text style={styles.question}>
              {painAssessmentQuestions[currentPainQuestion]}
            </Text>
            {currentPainQuestion === 0 && (
              <View>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={10}
                  step={1}
                  minimumTrackTintColor='#65A89F'
                  maximumTrackTintColor="lightgray"
                  thumbTintColor='#65A89F'
                  value={sliderValue}
                  onValueChange={(value) => setSliderValue(value)}
                />
                <View style={styles.sliderScale}>
                  {Array.from({ length: 11 }, (_, i) => (
                    <Text style={{color:'black', fontSize: 18}} key={i}>{i}</Text>
                  ))}
                </View>
                <Text style={styles.sliderValue}>{sliderValue.toString()}</Text>
              </View>
            )}

            {currentPainQuestion === 1 && (
              <View>
                <DropDownPicker
                  open={isDropDownOpen}
                  value={dropDownValue}
                  items={dropDownItems}
                  setOpen={setIsDropDownOpen}
                  setValue={setDropDownValue}
                  setItems={setDropDownItems}
                  // defaultValue={selectedPain}
                  containerStyle={{ height: 40 }}
                />
                <TextInput
                  multiline
                  numberOfLines={4}
                  style={styles.input}
                  placeholder="Please write a short description about your pain"
                  placeholderTextColor="#696969"
                  onChangeText={(text) => {
                    // Handle the user's input here
                  }}
                  />
              </View>
            )}

            {currentPainQuestion === 2 && (
              <View>
                {painDurationItems.map((pain) => (
                  <TouchableOpacity 
                    onPress={() => {setPainDuration(pain.value)}}
                    style={{
                      backgroundColor: painDuration === pain.value ? 'white' : '#65A89F',
                      borderWidth: painDuration === pain.value ? 1 : 0,
                      borderColor: '#65A89F',
                      padding: 12,
                      paddingHorizontal: 16,
                      borderRadius: 16,
                      alignItems: "center",
                      marginTop: 15
                    }}
                    key={pain.value}>
                    <Text style={{
                      fontFamily: 'Nunito Sans',
                      fontSize: 16,
                      fontWeight: '300',
                      color: painDuration === pain.value ? '#65A89F' : 'white'
                    }}>{pain.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.question}>{questions[currentQuestion]}</Text>
        )}
      </View>

      {currentQuestion !== questions.length - 1 ? (
        <View>
          {isPainAssessment ? null : (
            <React.Fragment>
              <TouchableOpacity onPress={() => handleNextQuestion('YES')} style={styles.ansButton}>
                <Text style={styles.ansButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNextQuestion('NO')} style={styles.ansButton}>
                <Text style={styles.ansButtonText}>No</Text>
              </TouchableOpacity>
            </React.Fragment>
          )}
        </View>
      ) : (
        !isPainAssessment && (
          <View>
          {imageLibrary && <Image source={{ uri: imageLibrary }} style={{ width: 200, height: 200, alignSelf: 'center' }} />}
          {imageCamera && <Image source={{ uri: imageCamera }} style={{ width: 200, height: 200, alignSelf: 'center' }} />}
          
          {imageLibrary &&
            <TouchableHighlight 
              onPress={unselectImage} 
              underlayColor={'white'}
              style={styles.unselectBtn}>
                <Text>Remove photo</Text>
            </TouchableHighlight>}

          {imageCamera && 
            <TouchableHighlight 
              onPress={unselectImage}
              underlayColor={'white'}
              style={styles.unselectBtn}>
                <Text>Remove photo</Text>
            </TouchableHighlight>}
        
          {imageCamera || imageLibrary ? (
            <TouchableOpacity
              style={[styles.imagePicker, styles.disabledPicker]}
            >
              <Icon name="image-outline" size={30} color="white" />
              <Text style={styles.imagePickerText}>Image Selected</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={pickImage}
              style={styles.imagePicker}
            >
              <Icon name="image-outline" size={30} color="white" />
              <Text style={styles.imagePickerText}>Select from Gallery</Text>
            </TouchableOpacity>
          )}
        
          {imageCamera || imageLibrary ? (
            <TouchableOpacity
              style={[styles.imagePicker, styles.disabledPicker]}
            >
              <Icon name="camera-outline" size={30} color="white" />
              <Text style={styles.cameraPickerText}>Image Selected</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={captureImage}
              style={styles.imagePicker}
            >
              <Icon name="camera-outline" size={30} color="white" />
              <Text style={styles.cameraPickerText}>Take a Picture</Text>
            </TouchableOpacity>
          )}
        </View>
        )
      )}

      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={isPainAssessment ? 
            currentPainQuestion === 0 ?
            () => setIsPainAssessment(false)
            : handlePreviousPainQuestion
            : handlePreviousQuestion}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        {!isPainAssessment && currentQuestion === 4 ? (
          <>
          <TouchableOpacity
              onPress={() =>{uploadUserAssessmentPics(); setIsPainAssessment(true)}}
              style={{
                borderColor: '#65A89F',
                borderWidth: 1,
                backgroundColor: 'white',
                padding: 12,
                paddingHorizontal: 10,
                borderRadius: 10,
                alignItems: "center",
                marginLeft: 8,
                marginBottom: 30
            }}
            >
              <Text style={[styles.buttonText, {color:'#4843fa'}]}>NEXT</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={isPainAssessment 
                ? currentPainQuestion === 2
                ? handleSensorPage
                : handleNextPainQuestion 
                : ()=>handleNextQuestion('')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity
        onPress={() => setIsPainAssessment(!isPainAssessment)}
        style={styles.toggleButton}
      >
        <Text style={styles.toggleButtonText}>
          {isPainAssessment ? "Switch to Physical Inspection" : "Switch to Pain Assessment"}
        </Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const questions = [
  'Question 1: Is there discoloration on the wrist?',
  'Question 2: Is there swelling on the wrist?',
  'Question 3: Is the wrist warm to touch? (Warmer than usual)',
  'Question 4: Are you experiencing any kind of pain when you touch or apply pressure to your wrist?',
  'Take a picture of your wrist in different angles',
];

const painAssessmentQuestions = [
  'Question 1: Rate your pain from 1 - 10 (1 - lowest 10 - highest)',
  'Question 2: Describe the pain based on the choices provided',
  'Question 3: How long have you been experiencing pain on your wrist?',
];

const styles = StyleSheet.create({
container: {
    padding: 40,
    paddingHorizontal: 20,
    height: '100%',
    backgroundColor: 'white'
},

unselectBtn:{
  alignSelf:'center',
  marginTop: 10
},

disabledPicker: {
  opacity: 0.5,
},

title: {
    fontFamily: 'Nunito Sans',
    fontSize: 40, 
    color: 'black', 
    fontWeight:'bold',
    marginTop: 45,
    flexDirection: "row"
},

titlePortion: {
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    color: 'black'
},

top: {
    marginVertical: 16
},

question: {
    fontFamily: 'Nunito Sans',
    fontSize: 22,
    marginTop: 40,
    marginBottom: 25,
    color: 'black'
},

textInputs: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
},

input: {
  marginTop: 20,
  borderWidth: 1,
  borderRadius: 4,
  borderColor: '#000',
  backgroundColor: '#FFFFFF',
  color: '#000000',
  fontSize: 12,
},

ansButton: {
    backgroundColor: '#65A89F',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 15
},

ansButtonText: {
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontWeight: '300',
    color: 'white'
},

bottom: {
    marginTop: 40,
    marginBottom: 12,
    marginLeft:10,
    marginRight:10,
    paddingVertical: 16,
    justifyContent: "space-between",
    flexDirection: "row"
},

button: {
    backgroundColor: '#65A89F',
    padding: 12,
    paddingHorizontal: 26,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30
},

buttonText: {
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
},

cameraPicker: {
    backgroundColor: '#65A89F',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  cameraPickerText: {
    color: 'white',
    marginLeft: 10,
  },

  imagePicker: {
    backgroundColor: '#65A89F',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  imagePickerText: {
    color: 'white',
    marginLeft: 10,
  },

  slider: {
    width: 358,
    marginLeft: 3,
  },

  sliderValue: {
    fontFamily: 'Nunito Sans',
    fontSize: 18,
    marginTop: 10,
    color: 'black',
    textAlign: 'center',
    
  },

  sliderScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
});

export default Questionnaire;