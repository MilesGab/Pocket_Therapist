import { Button } from "@react-native-material/core";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

function AssessmentScreen() {
  const navigation = useNavigation();
  
  return(
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>{}}>
          <Icon name="arrow-back" style={{fontSize:38, color:'black', marginRight: 12}}/>
        </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Pocket Therapist</Text>
      </View>

      <View style={styles.bannerContainer}>
        <Image source={{uri:'https://ouch-cdn2.icons8.com/bJCcxzfZMUhDQgFEAGojnAG3gz0FBGtY9wnkmX__L5E/rs:fit:368:368/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNTE3/LzU1NTAxMjQ5LTUx/ZGQtNDUwYi1iOTUw/LTM0YzZhZjk2MDk2/Yy5zdmc.png'}} style={styles.banner} resizeMode={"contain"}onError={(e) => console.log('Image load error:', e.nativeEvent.error)}/>
  </View>
  

        <Text style={styles.questionTitle}>Do you want to start the Assessment?</Text>
        <TouchableOpacity  onPress={() => navigation.navigate('Questionnaire')} style={styles.startButton}>
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>
        
      </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%',
    padding: 20,
  },

  titleContainer: {
    padding: 20,
  },

  title: {
    fontSize: 32, 
    color: 'black', 
    fontWeight:'bold',
    textAlign: "center",
    marginTop: 45,
    flexDirection: "row"
  },

  bannerContainer:{
    justifyContent:"center",
    alignContent:"center",
    alignItems: "center"
  },

  banner: {
    height:300,
    width:300
  },

  questionTitle: {
    fontSize: 20, 
    color: 'black', 
    fontWeight:'bold',
    textAlign: "center",
    marginTop: 30,
    marginBottom:15
  },

  startButton: {
    backgroundColor: '#4843fa',  // Background color
        borderRadius: 8,          // Border radius
        paddingVertical: 10,      // Vertical padding
        paddingHorizontal: 20,    // Horizontal padding
        alignItems: 'center',     // Center the content horizontally
        marginBottom: 400
  },

  startButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: "white",
    alignItems:"center"
  }
});
export default AssessmentScreen;