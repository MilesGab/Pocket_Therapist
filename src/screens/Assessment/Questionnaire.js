import { TextInput } from "@react-native-material/core";
import React, { useState } from "react";
import {StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProgressBar } from "react-native-paper";


function Questionnaire () {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));

  const handleNextQuestion = () => {
    if(currentQuestion < questions.length - 1){
        setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Assessment</Text>
            <Text style={styles.titlePortion}>Physical Inspection</Text>
            <View style = {styles.top}>
            <ProgressBar progress={progress / 100} color="#f9bc27"/>
                <Text style={styles.question}>{questions[currentQuestion]}</Text>
            </View>

            <View>
                {/*<TextInput label="Answer"></TextInput>*/}
                <TouchableOpacity style = {styles.ansButton}>
                    <Text style = {styles.ansButtonText}>YES</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.ansButton}>
                    <Text style = {styles.ansButtonText}>NO</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.bottom}>
                <TouchableOpacity onPress={handlePreviousQuestion}
                    disabled={currentQuestion === 0} style={styles.button}>
                    <Text style={styles.buttonText}>BACK</Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={handleNextQuestion}
                    disabled={currentQuestion === questions.length - 1} style={styles.button}>
                    <Text style={styles.buttonText}>NEXT</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    );
};

const questions = [
    'Question 1: Is there discoloration on the wrist?',
    'Question 2: Is there swelling on the wrist?',
    'Question 3: Is the wrist warm to touch? (Warmer than usual)',
    'Question 4: Are you experiencing any kind of pain when you touch or apply pressure to your wrist?',
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
    marginTop: 150,
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
    color: 'white'
}
});
export default Questionnaire;