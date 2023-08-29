import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert, TouchableWithoutFeedback, Keyboard } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


export default function Register({ navigation }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onHandleSignUp = async () => {
    try {
      // Create user account using Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);

      // Get the user's UID
      const uid = userCredential.user.uid;

      // Store user information in Firestore
      await firestore().collection('users').doc(uid).set({
        name,
        email,
      });

      console.log('User account created & signed up!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const onHandleLogin = () => {
    // if (email !== "" && password !== "") {
    //   signInWithEmailAndPassword(auth, email, password)
    //     .then(() => console.log("Login success"))
    //     .catch((err) => Alert.alert("Login error", err.message));
    // }

    navigation.navigate('Login')
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        
        <View style={styles.image_container}>
        </View>

        <View style={styles.whiteSheet} />
        <SafeAreaView style={styles.form}>
          <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          autoCapitalize="none"
          keyboardType="default"
          textContentType="name"
          autoFocus={false}
          value={name}
          onChangeText={(text) => setName(text)}
        />
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
        <TouchableOpacity style={styles.button} onPress={onHandleSignUp}>
          <Text style={{fontWeight: 'bold', color: '#fff', fontSize: 18}}>Sign Up</Text>
        </TouchableOpacity>
        <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
          <Text style={{color: 'gray', fontWeight: '600', fontSize: 14}}>Alreadt have an accout? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{color: '#f57c00', fontWeight: '600', fontSize: 14}}> Sign In</Text>
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
    backgroundColor: "#6fa8dc",
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
  // backImage: {
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
    backgroundColor: '#f57c00',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
});
