import { TextInput } from "@react-native-material/core";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { ProgressBar } from "react-native-paper";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from "@react-native-community/slider";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";


const Questionnaire = ({ updatePainData, updatePhysicalData }) => {
  const navigation = useNavigation();

  // State for tracking the current question, answers, and selected image
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [painAnswers, setPainAnswers] = useState(Array(questions.length).fill(''));
  const [selectedImage, setSelectedImage] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);

  const [isPainAssessment, setIsPainAssessment] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [dropDownValue, setDropDownValue] = useState('');
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
    {value:'few_days', label: 'Few Days'},
    {value:'few_weeks', label: 'Few Weeks'},
    {value:'few_months', label: 'Few Months'},
    {value:'several_months', label: 'Several Months'},
    {value:'years', label: 'Years'},
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

  const handleImageLibraryPicker = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setSelectedImage(response);
      }
    });
  };

  const handleCameraPicker = () => {
    const options = {
      title: 'Take a Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image capture');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setSelectedImage(response);
      }
    });
  };

  const progress = isPainAssessment
    ? ((currentPainQuestion + 1) / painAssessmentQuestions.length) * 100
    : ((currentQuestion + 1) / questions.length) * 100;

  const handleSensorPage = () => {
    updatePainData([sliderValue, dropDownValue, painDuration]);
    updatePhysicalData(painAnswers);
    navigation.navigate('JointAssessment');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assessment</Text>
      <Text style={isPainAssessment ? styles.titlePortion : styles.titlePortion}>
        {isPainAssessment ? 'Pain Assessment' : 'Physical Inspection'}
      </Text>

      <View style={styles.top}>
        <ProgressBar progress={progress / 100} color="#f9bc27" />
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
                  minimumTrackTintColor="blue"
                  maximumTrackTintColor="lightgray"
                  thumbTintColor="blue"
                  value={sliderValue}
                  onValueChange={(value) => setSliderValue(value)}
                />
                <View style={styles.sliderScale}>
                  {Array.from({ length: 11 }, (_, i) => (
                    <Text key={i}>{i}</Text>
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
                {dropDownValue === 'Others' && (
                  <TextInput
                    placeholder="Please specify"
                    onChangeText={(text) => {
                      // Handle the user's input here
                    }}
                  />
                )}
              </View>
            )}

            {currentPainQuestion === 2 && (
              <View>
                {painDurationItems.map((pain) => (
                  <TouchableOpacity 
                    onPress={() => {setPainDuration(pain.value)}}
                    style={{
                      backgroundColor: painDuration === pain.value ? 'white' : '#4843fa',
                      borderWidth: painDuration === pain.value ? 1 : 0,
                      borderColor: '#4843fa',
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
                      color: painDuration === pain.value ? '#4843fa' : 'white'
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
      {/* Display physical assessment questions or image picker buttons */}
      {currentQuestion !== questions.length - 1 ? (
        // Display physical assessment questions
        <View>
           {isPainAssessment ? null : ( // Conditionally render the "YES" and "NO" buttons
            <React.Fragment>
              <TouchableOpacity onPress={() => handleNextQuestion('YES')} style={styles.ansButton}>
                <Text style={styles.ansButtonText}>YES</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleNextQuestion('NO')} style={styles.ansButton}>
                <Text style={styles.ansButtonText}>NO</Text>
              </TouchableOpacity>
            </React.Fragment>
          )}
        </View>
      ) : (
        !isPainAssessment && (
        <View>
          <TouchableOpacity
            onPress={handleImageLibraryPicker}
            style={styles.imagePicker}
          >
            <Icon name="image-outline" size={30} color="white" />
            <Text style={styles.imagePickerText}>Select from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCameraPicker}
            style={styles.cameraPicker}
          >
            <Icon name="camera-outline" size={30} color="white" />
            <Text style={styles.cameraPickerText}>Take a Picture</Text>
          </TouchableOpacity>
        </View>
        )
      )}

      {/* Display the selected image */}
      {selectedImage && (
        <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
      )}

      {/* Navigation buttons (BACK, NEXT, Proceed to Pain Assessment) */}
      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={isPainAssessment ? 
            currentPainQuestion === 0 ?
            () => setIsPainAssessment(false)
            : handlePreviousPainQuestion
            : handlePreviousQuestion}
          style={styles.button}
        >
          <Text style={styles.buttonText}>BACK</Text>
        </TouchableOpacity>

        {!isPainAssessment && currentQuestion === 4 ? (
          <>
          <TouchableOpacity
              onPress={() => setIsPainAssessment(true)}
              style={{
                borderColor: '#4843fa',
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
              <Text style={[styles.buttonText, {color:'#4843fa'}]}>PROCEED TO PAIN ASSESSMENT</Text>
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
              <Text style={styles.buttonText}>NEXT</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Toggle button for switching between Physical Inspection and Pain Assessment */}
      <TouchableOpacity
        onPress={() => setIsPainAssessment(!isPainAssessment)}
        style={styles.toggleButton}
      >
        <Text style={styles.toggleButtonText}>
          {isPainAssessment ? "Switch to Physical Inspection" : "Switch to Pain Assessment"}
        </Text>
      </TouchableOpacity>
    </View>
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

ansButton: {
    backgroundColor: '#4843fa',
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
    backgroundColor: '#4843fa',
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
    backgroundColor: '#4843fa',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 10, // Use a large value to make it oval-shaped
    alignItems: 'center',
    marginTop: 15,
  },
  cameraPickerText: {
    color: 'white',
    marginLeft: 10, // Adjust the spacing between the icon and label
  },

  imagePicker: {
    backgroundColor: '#4843fa',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 10, // Use a large value to make it oval-shaped
    alignItems: 'center',
    marginTop: 15,
  },
  imagePickerText: {
    color: 'white',
    marginLeft: 10, // Adjust the spacing between the icon and label
  },

  slider: {
    width: 358, // Adjust the width of the slider
    marginLeft: 3
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