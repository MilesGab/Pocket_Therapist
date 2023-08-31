import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Avatar, IconButton, Box } from "@react-native-material/core";
import Icon from 'react-native-vector-icons/Ionicons';
import { blue } from 'react-native-reanimated';
import { FlatList, ScrollView, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useUserContext } from '../../../contexts/UserContext';
import PatientScreen from './roles/PatientScreen';
import DoctorScreen from './roles/DoctorScreen';


const HomeScreen = ({ navigation }) => {
  const { userData, updateUser } = useUserContext();

  const [selectedId, setSelectedId] = React.useState();

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Consultation',
      date: '25',
      day: 'Fri',
      doctor: 'Dr. Mim Akhter',
      time: '03:00 PM'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Catch up',
      date: '28',
      day: 'Mon',
      doctor: 'Dr. Mim Akhter',
      time: '03:00 PM'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Consultation',
      date: '31',
      day: 'Thu',
      doctor: 'Dr. Mim Akhter',
      time: '03:00 PM'
    },
  ];

  const Item = ({item, onPress, backgroundColor, textColor}) => (
    
    <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
      <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', paddingHorizontal: 12, paddingVertical: 18,gap: 12}}>
        <Box style={{borderRadius: 20, paddingVertical: 12, paddingHorizontal: 16}}>
          <Text style={[styles.title,{color:textColor, fontSize: 32, fontWeight: 'bold'}]}>{item.date}</Text>
          <Text style={[styles.title,{color:textColor, fontSize: 20, textAlign: 'center'}]}>{item.day}</Text>
        </Box>
        <Box style={{paddingVertical: 8}}>
          <Text style={[styles.title, {color:textColor}]}>{item.time}</Text>
          <Text style={[styles.title, {color:textColor, fontWeight: 'bold'}]}>{item.doctor}</Text>
          <Text style={[styles.title, {color: textColor}]}>{item.title}</Text>
        </Box>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#1C6BA4' : '#257cba';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  const onPressFunction = () => {
    console.log(userData);
  }

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
    <>
      {userData?.role === 0 ? <PatientScreen navigation={navigation} /> : <DoctorScreen navigation={navigation} />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 32
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32
  },
  headerText: {
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    color: 'black',
    fontStyle: 'normal',
    fontWeight: 'bold'
  },
  services: {
    marginBottom: 16
  },
  servicesText: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    color: 'black',
    fontStyle: 'normal',
    fontWeight: 'bold'
  },
  stats: {
    height: '35%',
    marginBottom: 16
  },
  footerText: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    color: 'black',
    fontStyle: 'normal',
    fontWeight: 'bold'
  },
  item: {
    height: 132,
    width: 260,
    borderRadius: 28,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 18
  }
});

export default HomeScreen;
