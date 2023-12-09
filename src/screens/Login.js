import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, SafeAreaView, TouchableOpacity, StatusBar, TouchableWithoutFeedback, Keyboard, Image } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';
import { useUserContext } from "../../contexts/UserContext";

export default function Login({ navigation }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userLogin, updateUser } = useUserContext();

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
            updateUser(userData);
            console.log('saved! @Login');
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
        <View style={styles.whiteSheet} />
        <SafeAreaView style={styles.form}>
        <View>
          <Image
            source={require('../../assets/images/pt_icon.png')}
            style={{
                width: 150,
                height: 140,
                marginTop: 40,
                marginBottom: 20,
                alignSelf: 'center'
            }}
          />
      </View>
          <Toast
            position='bottom'
            bottomOffset={50}
          />
          <Text style={styles.title}>Log In</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor="gray"
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
          placeholderTextColor="gray"
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
            <Text style={{color: '#65A89F', fontWeight: '600', fontSize: 14}}> Sign Up</Text>
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
    backgroundColor: "#65A89F",
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "#65A89F",
    alignSelf: "center",
    paddingBottom: 24,
  },

  avtrpos: {
    marginTop: 10,
    alignItems: 'center'
  },
  
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    color:'black'
  },

  whiteSheet: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    width: '100%',
    height: 650,
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
  },

  button: {
    backgroundColor: '#65A89F',
    height: 58,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },

});
