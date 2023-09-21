import { TextInput } from "@react-native-material/core";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { ProgressBar } from "react-native-paper";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from "@react-native-community/slider";
import DropDownPicker from "react-native-dropdown-picker";

function Questionnaire() {

  const questions = [
    'Question 1: Is there discoloration on the wrist?',
    'Question 2: Is there swelling on the wrist?',
    'Question 3: Is the wrist warm to touch? (Warmer than usual)',
    'Question 4: Are you experiencing any kind of pain when you touch or apply pressure to your wrist?',
    'Take a picture of your wrist in different angles',
  ];

  const painAssessmentQuestions = [
    'Question 1: On a scale of 0-10, how would you rate your pain?',
    'Question 2: What type of pain are you experiencing?',
  ];

  const painChoices = [
    {label: 'Sharp', value: 'Sharp'},
    {label: 'Dull', value: 'Dull'},
    {label: 'Numb', value: 'Numb'},
    // Add more questions as needed
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));
  const [selectedImage, setSelectedImage] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const [selectedPain, setSelectedPain] = useState(null);
  const [isOthersSelected, setIsOthersSelected] = useState(false);
  const [isPainAssessment, setIsPainAssessment] = useState(false);
  const [currentPainQuestion, setCurrentPainQuestion] = useState(0);

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
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

  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
          <PainAssessmentQuestions
            currentPainQuestion={currentPainQuestion}
            painAssessmentQuestions={painAssessmentQuestions}
            sliderValue={sliderValue}
            selectedPain={selectedPain}
            isOthersSelected={isOthersSelected}
            setSelectedPain={setSelectedPain}
            setIsOthersSelected={setIsOthersSelected}
            setSliderValue={setSliderValue}
          />
        ) : (
          <PhysicalInspectionQuestions
            currentQuestion={currentQuestion}
            questions={questions}
            isPainAssessment={isPainAssessment}
          />
        )}
      </View>

      {currentQuestion !== questions.length - 1 ? (
        <View>
          {isPainAssessment ? null : (
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
      ) : null /* No image selection buttons */}

      {selectedImage && (
        <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
      )}

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


function PainAssessmentQuestions({
  currentPainQuestion,
  painAssessmentQuestions,
  sliderValue,
  selectedPain,
  isOthersSelected,
  setSelectedPain,
  setIsOthersSelected,
  setSliderValue,
}) {
  const renderPainAssessmentQuestion = () => {
    if (currentPainQuestion === 0) {
      return (
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
      );
    } else if (currentPainQuestion === 1) {
      return (
        <View>
          <DropDownPicker
            items={painChoices}
            defaultValue={selectedPain}
            containerStyle={{ height: 40 }}
            placeholder="Which Pain are you experiencing?"
            onChangeItem={(item) => {
              setSelectedPain(item.value);
              setIsOthersSelected(item.value === 'Others');
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
      );
    } else {
      return null;
    }
  };

  return (
    <View>
      <Text style={styles.question}>
        {painAssessmentQuestions[currentPainQuestion]}
      </Text>
      {renderPainAssessmentQuestion()}
    </View>
  );
}

function PhysicalInspectionQuestions({
  currentQuestion,
  questions,
  handleImageLibraryPicker,
  handleCameraPicker,
  isPainAssessment,
}) {
  return (
    <View>
      <Text style={styles.question}>
        {questions[currentQuestion]}
      </Text>
      {currentQuestion === questions.length - 1 && (
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
    </View>
  );
}

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