import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../config/firebase.js";
const backImage = require("../../assets/images/pt_icon.png");
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import { AppContext } from "../../contexts/AppContext";

export default function Login({ navigation, setUserName }) {

  const context = React.useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleLogin = () => {
    if (email !== '' && password !== '') {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
          console.log('Login successful!');
          const uid = userCredential.user.uid;
          const userSnapshot = await firestore().collection('users').doc(uid).get();
          const userData = userSnapshot.data();
          if (userData) {
            // context.updateUser({ ...userData });
            console.log(context.name);
          }
          navigation.navigate('MyTabs');
        })
        .catch(error => {
          if (error.code === 'auth/user-not-found') {
            console.log('User not found. Please sign up.');
          } else if (error.code === 'auth/wrong-password') {
            console.log('Wrong password. Please try again.');
          } else if (error.code === 'auth/invalid-email') {
            console.log('Invalid email format.');
          } else {
            console.error(error);
          }
        });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please enter an email and password',
        visibilityTime: 3000,
      });
      console.log("NO EMAIL AND PASS");
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <View style={styles.image_container}>
        </View>
        <View style={styles.whiteSheet} />
        <SafeAreaView style={styles.form}>
          <Toast
            position='bottom'
            bottomOffset={50}
          />
          <Text style={styles.title}>Log In</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={false}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}> Log In</Text>
        </TouchableOpacity>
        <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
          <Text style={{color: 'gray', fontWeight: '600', fontSize: 14}}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={{color: '#6fa8dc', fontWeight: '600', fontSize: 14}}> Sign Up</Text>
          </TouchableOpacity>
        </View>
        </SafeAreaView>
        <StatusBar barStyle="light-content" />
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f57c00",
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "orange",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  image_container: {
    // backgroundColor: 'blue',
    // height: 400,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  // backImage: {6fa8dc
  //   display: 'flex',
  //   alignItems: 'center',   // Center horizontally
  //   justifyContent: 'center',   // Center vertically
  //   width: 160,
  //   height: 150,
  //   top: 16,
  //   resizeMode: 'cover',
  // },
  whiteSheet: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    width: '100%',
    height: 640,
    position: "absolute", 
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 40,
    marginTop: 50,
  },
  button: {
    backgroundColor: '#6fa8dc',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});