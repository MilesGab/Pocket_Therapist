import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView} from 'react-native';
import {Avatar} from "@react-native-material/core";
import Icon from "react-native-vector-icons/Ionicons";

const Profile = () => {

  return (
    <View style={styles.container}>
      <View style={styles.whiteSheet}>
      <View style= {styles.avtrpos}>
        <Avatar label={"Mico Ruiz Linco"} size={130} color='#CEDDF7' style = {{borderWidth:5, borderColor: 'white'}}/>
      </View>
        <View style={styles.heading}>
            <Text style={styles.headingTxt}>Personal Information</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.infoTxt}>Complete Name</Text>
        </View>
          <View style={styles.rowTxt}>
            <Text style={styles.userInfoTxt}>Mico Ruiz Linco</Text>
          </View>
        <View style={styles.row}>
          <Text style={styles.infoTxt}>Age</Text>
        </View>
          <View style={styles.rowTxt}>
            <Text style={styles.userInfoTxt}>22</Text>
          </View>
        <View style={styles.row}>
          <Text style={styles.infoTxt}>Birthday</Text>
        </View>
          <View style={styles.rowTxt}>
            <Text style={styles.userInfoTxt}>April 28, 2001</Text>
          </View>
        <View style={styles.row}>
          <Text style={styles.infoTxt}>Sex assigned at birth</Text>
        </View>
          <View style={styles.rowTxt}>
            <Text style={styles.userInfoTxt}>Male</Text>
          </View>
        {/*<View style={styles.divider}>
        
          </View>*/}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CEDDF7',
    flex: 1,
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
  },

  whiteSheet: {
    width: '100%',
    height: 600,
    position: "absolute", 
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingLeft: 18,
  },

  avtrpos: {
    marginTop: -70,
    alignItems: 'center'
  },

  headingTxt:{
    paddingTop: 20,
    fontWeight: 'bold',
    fontSize: 22,
    color: 'black',
  },

  divider:{
    width: '120%',
    height: 13,
    marginTop: 420,
    backgroundColor: '#CEDDF7',
    position: "absolute",
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoTxt:{
    paddingTop: 20, 
    fontSize: 14, 
    color: '#5b88b0', 
    textAlign: 'left',

  },

  userInfoTxt: {
    fontSize: 18, 
    paddingTop: 5,
    color: '#4F556C',
    textAlign: 'left',
    fontWeight: 'bold',
  },

});

export default Profile;
