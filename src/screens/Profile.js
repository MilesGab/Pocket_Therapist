import React from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import {Avatar} from "@react-native-material/core";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Icon from "react-native-vector-icons/Ionicons";
import { useUserContext } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

const InformationSection = (props) => {
  const { userData, updateUser } = useUserContext();
  const fullName = userData.firstName + " " + userData.lastName;
  
  const timestamp = new Date(
    userData?.dateOfBirth.seconds * 1000 + userData?.dateOfBirth.nanoseconds / 1000000
  );

  const formattedDate = timestamp.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  const currentDate = new Date();
  const age = currentDate.getFullYear() - timestamp.getFullYear();

  const isBirthdayThisYear =
  currentDate.getMonth() < timestamp.getMonth() ||
  (currentDate.getMonth() === timestamp.getMonth() &&
    currentDate.getDate() < timestamp.getDate());

  const finalAge = isBirthdayThisYear ? age - 1 : age;

  const sexMap = {
    male: 'Male',
    female: 'Female',
  };

  return (
    <>
      <View style={styles.heading}>
      <Text style={[styles.headingTxt, {flex:1}]}>Personal Information</Text>
      <TouchableOpacity onPress={()=>props.handleEditMode()}>
        <Icon name="create-outline" size={26}/>
      </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.infoTxt}>Complete Name</Text>
      </View>
      <View style={styles.rowTxt}>
        <Text style={styles.userInfoTxt}>{userData.firstName} {userData.lastName}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.infoTxt}>Age</Text>
      </View>
      <View style={styles.rowTxt}>
        <Text style={styles.userInfoTxt}>{finalAge || '---'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.infoTxt}>Birthday</Text>
      </View>
      <View style={styles.rowTxt}>
        <Text style={styles.userInfoTxt}>{formattedDate || '---'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.infoTxt}>Sex assigned at birth</Text>
      </View>
      <View style={styles.rowTxt}>
        <Text style={styles.userInfoTxt}>{sexMap[userData.sex] || '---'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.infoTxt}>E-mail Address</Text>
      </View>
      <View style={styles.rowTxt}>
        <Text style={styles.userInfoTxt}>{userData.email}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.infoTxt}>Contact Number</Text>
      </View>
      <View style={styles.rowTxt}>
        <Text style={styles.userInfoTxt}>{userData.contact}</Text>
      </View>
    </>
  )
}

const EditSection = (props) => {
  const { userData, updateUser } = useUserContext();
  const [open, setOpen] = React.useState(false);
  const [dropDownItems, setDropDownItems] = React.useState([
    {label: 'Male', value: 'male'},
    {label: 'Female', value:'female'},
    {label: 'Others', value:'others'}
  ]);

  const userFirstName = '' + userData?.firstName;
  const userLastName = '' + userData?.lastName;
  const userEmail = '' + userData?.email;
  const userContact = '' + userData?.contact;

  //Edit Values
  const [firstName, setFirstName] = React.useState(userFirstName);
  const [lastName, setLastName] = React.useState(userLastName);
  const [dropDownValue, setDropDownValue] = React.useState();
  const [date, setDate] = React.useState(new Date());
  const [emailAddress, setEmailAddress] = React.useState(userEmail);
  const [contactNumber, setContactNumber] = React.useState(userContact);


  const handleCancel = () => {
    props.handleEditMode();
  }

  const handleUserUpdate = async (uid, newData) => {
    const userRef = firestore().collection('users').doc(uid);
  
    return userRef.update(newData)
      .then(() => {
        console.log('User data updated successfully');
      })
      .catch((error) => {
        console.error('Error updating user data:', error);
      });
  };

  const handleSave = () => {
    const trimmedUid = userData.uid.trim();
    const newData = {
      firstName: firstName,
      lastName: lastName,
      sex: dropDownValue,
      dateOfBirth: date,
      email: emailAddress,
      contact: contactNumber,
    };
  
    const uid = trimmedUid;
  
    handleUserUpdate(uid, newData);
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: false,
    });
  };
  
  const showDatepicker = () => {
    showMode('date');
  };

  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  return (
    <>
      <View style={styles.heading}>
        <Text style={[styles.headingTxt, {flex:1}]}>Edit Personal Information</Text>
      </View>
      
      <View style={{display:'flex', flexDirection:'row', width: '100%', gap: 10}}>
        <View style={{flexDirection:'column', width: '45%'}}>
          <View style={styles.row}>
            <Text style={styles.infoTxt}>First Name</Text>
          </View>
          <View style={[styles.rowTxt, {backgroundColor:'rgba(0,0,0,0.1)', padding:2, borderRadius:6}]}>
            <TextInput
              keyboardType="default"
              textContentType="name" 
              value={firstName} 
              onChangeText={(text)=>setFirstName(text)}
              style={styles.textInput}/>
          </View>
        </View>
        <View style={{flexDirection:'column', width: '50%'}}>
          <View style={styles.row}>
            <Text style={styles.infoTxt}>Last Name</Text>
          </View>
          <View style={[styles.rowTxt, {backgroundColor:'rgba(0,0,0,0.1)', padding:2, borderRadius:6}]}>
            <TextInput
              keyboardType="default"
              textContentType="name" 
              value={lastName}
              onChangeText={(text)=>setLastName(text)} 
              style={styles.textInput}/>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.infoTxt}>Date of Birth</Text>
      </View>
      <View style={[styles.rowTxt, {display:'flex', flexDirection:'row', alignItems:'center', width:'100%', backgroundColor:'rgba(0,0,0,0.1)', padding:8, borderRadius:6}]}>
        <Text style={[styles.userInfoTxt,{fontSize: 18, fontWeight:'normal', flex:1, color:'black'}]}>{userData.birthday || formattedDate}</Text>
        <TouchableOpacity onPress={showDatepicker}>
          <Icon name="calendar" color={'black'} style={{fontSize:18}}/>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.infoTxt}>Sex</Text>
      </View>
      <View style={[styles.rowTxt,{width:'100%'}]}>
        <DropDownPicker
          open={open}
          value={dropDownValue} 
          items={dropDownItems}
          setOpen={setOpen}
          setValue={setDropDownValue}
          setItems={setDropDownItems}/>
      </View>
      <View style={styles.row}>
        <Text style={styles.infoTxt}>E-mail Address</Text>
      </View>
      <View style={[styles.rowTxt,{width:'100%', backgroundColor:'rgba(0,0,0,0.1)', padding:8, borderRadius:6}]}>
        <TextInput
          keyboardType="email-address"
          textContentType="emailAddress" 
          value={emailAddress}
          onChangeText={(text)=>setEmailAddress(text)} 
          style={styles.textInput}/>
      </View>
      <View style={styles.row}>
        <Text style={styles.infoTxt}>Contact Number</Text>
      </View>
      <View style={[styles.rowTxt,{width:'100%', backgroundColor:'rgba(0,0,0,0.1)', padding:8, borderRadius:6}]}>
        <TextInput
          keyboardType="number-pad"
          textContentType="telephoneNumber" 
          value={contactNumber}
          onChangeText={(text)=>setContactNumber(text)} 
          style={[styles.textInput]}/>
      </View>
      <View style={{display:'flex', flexDirection:'row', gap:12,justifyContent:'center', alignContent:'center', alignItems:'center', marginTop: 20}}>
        <TouchableOpacity onPress={()=>handleSave()} style={{width:'50%', backgroundColor:'#f57c00', borderRadius: 10, padding:12}}>
          <Text style={{textAlign:'center', color:'white', fontSize:20, fontWeight: '500'}}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const Profile = () => {
  const { userData, updateUser } = useUserContext();
  const fullName = userData.firstName + " " + userData.lastName;
  const navigation = useNavigation();

  const [isEditMode, setEditMode] = React.useState(false);

  const handleEditMode = () => {
    setEditMode(!isEditMode);
  };

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('Logout successful!');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.whiteSheet}>
      <View style= {styles.avtrpos}>
        <Avatar label={fullName} size={130} color='#CEDDF7' style = {{borderWidth:5, borderColor: 'white'}}/>
      </View>
      {/* Information Section*/}
      <View>
        {isEditMode ? (<EditSection handleEditMode={handleEditMode}/>) : (<InformationSection handleEditMode={handleEditMode}/>)}
      </View>
      {/* Footer Section */}
      <View style={{justifyContent:'center', alignContent:'center', alignItems:'center', marginTop: 20}}>
        {isEditMode ? (null) : (
          <TouchableOpacity onPress={handleLogout} style={{width:'50%', backgroundColor:'orange', borderRadius: 14, padding:12}}>
          <Text style={{textAlign:'center', color:'white', fontSize:26, fontWeight:'500'}}>Log Out</Text>
          </TouchableOpacity>
        )}
      </View>
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
    height: 700,
    position: "absolute", 
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 18,
  },

  avtrpos: {
    marginTop: -70,
    alignItems: 'center'
  },

  heading:{
    display:'flex',
    flexDirection:'row',
    alignContent:'center',
    alignItems:'center',
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
  },

  infoTxt:{
    paddingTop: 20, 
    fontSize: 14, 
    color: '#5b88b0', 
    textAlign: 'left',

  },

  userInfoTxt: {
    fontSize: 18, 
    color: '#4F556C',
    textAlign: 'left',
    fontWeight: 'bold',
  },

  textInput: {
    borderColor: 'rgba(0,0,0,0.3)',
    fontSize:16
  }

});

export default Profile;
