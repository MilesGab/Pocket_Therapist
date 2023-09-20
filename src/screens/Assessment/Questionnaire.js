import { TextInput } from "@react-native-material/core";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { ProgressBar } from "react-native-paper";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from "@react-native-community/slider";
import DropDownPicker from "react-native-dropdown-picker";

function Questionnaire() {
  // State for tracking the current question, answers, and selected image
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [selectedImage, setSelectedImage] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [selectedPain, setSelectedPain] = useState(null); // Selected pain choice
  const [isOthersSelected, setIsOthersSelected] = useState(false); //2nd question Pain assessment

  // State for tracking whether the user is in the pain assessment section
  const [isPainAssessment, setIsPainAssessment] = useState(false);

  // State for tracking the current pain assessment question
  const [currentPainQuestion, setCurrentPainQuestion] = useState(0);

  // Function to handle moving to the next question in the physical assessment
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Function to handle moving to the previous question in the physical assessment
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Function to handle moving to the next pain assessment question
  const handleNextPainQuestion = () => {
    if (currentPainQuestion < painAssessmentQuestions.length - 1) {
      setCurrentPainQuestion(currentPainQuestion + 1);
    }
  };

  // Function to handle moving to the previous pain assessment question
  const handlePreviousPainQuestion = () => {
    if (currentPainQuestion > 0) {
      setCurrentPainQuestion(currentPainQuestion - 1);
    }
  };

  // Function to pick an image from the device's library
  const handleImageLibraryPicker = () => {
    // Configure the image picker options (you can customize this)
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    // Show the image picker dialog
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // Set the selected image
        setSelectedImage(response);
      }
    });
  };

  // Function to capture a photo using the device's camera
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

  // Calculate progress based on the current question
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Check if all previous questions have been answered to enable proceeding to Pain Assessment
  //const canProceedToPainAssessment = answers.every(answer => answer !== '');

  const formatSliderValue = (value) => {
    return value.toString();
  };

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
                  items={painChoices.map((choice) => ({
                    label: choice,
                    value: choice,
                  }))}
                  defaultValue={selectedPain}
                  containerStyle={{ height: 40 }}
                  onChangeItem={(items) => {
                    setSelectedPain(items.value);
                    setIsOthersSelected(items.value === 'Others');
                  }}
                />
                {isOthersSelected && (
                  <TextInput
                    placeholder="Please specify"
                    onChangeText={(text) => {
                      // Handle the user's input here
                    }}
                  />
                )}
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
              <TouchableOpacity style={styles.ansButton}>
                <Text style={styles.ansButtonText}>YES</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ansButton}>
                <Text style={styles.ansButtonText}>NO</Text>
              </TouchableOpacity>
            </React.Fragment>
          )}
        </View>
      ) : (
        // Render buttons for image library and camera access
        // Camera buttons will only show when it is in Physical Inspection part of the assessment
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
          onPress={isPainAssessment ? handlePreviousPainQuestion : handlePreviousQuestion}
          disabled={
            isPainAssessment
              ? currentPainQuestion === 0
              : currentQuestion === 0
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>BACK</Text>
        </TouchableOpacity>

        {/* {currentQuestion === questions.length - 1 && (
          <TouchableOpacity
            onPress={() => setIsPainAssessment(true)}
            disabled={!canProceedToPainAssessment}
            style={[
              styles.button,
              !canProceedToPainAssessment && { backgroundColor: 'gray' },
            ]}
          >
            <Text style={styles.buttonText}>Proceed to Pain Assessment</Text>
          </TouchableOpacity>
        )} */}

        <TouchableOpacity
          onPress={isPainAssessment ? handleNextPainQuestion : handleNextQuestion}
          disabled={
            isPainAssessment
              ? currentPainQuestion === painAssessmentQuestions.length - 1
              : currentQuestion === questions.length - 1
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>NEXT</Text>
        </TouchableOpacity>
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

const painChoices = [
  'Sharp: Sudden, intense, and localized pain sensation.',
  'Dull: Aching or throbbing pain that is not sharp or intense.',
  'Stabbing: Brief, piercing pain.',
  'Shooting: Pain that radiates or shoots along the wrist or into the hand.',
  'Burning: Sensation of heat or burning in the wrist.',
  'Tingling: Prickling or "pins and needles" sensation.',
  'Stiff: Pain accompanied by a sensation of stiffness or reduced range of motion.',
  'Numb: Partial or complete loss of sensation in the wrist area.',
  'Cramping: Pain with a constricting or tightening sensation in the wrist.',
  'Sore: Tenderness or discomfort in the wrist, often associated with overuse or strain.',
  'Others',
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
    marginTop: 100,
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
    paddingHorizontal: 16,
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