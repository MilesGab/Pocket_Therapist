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

  return (
    <>
      {userData?.role === 0 ? (
        <PatientScreen navigation={navigation} />
        ) : (
        <DoctorScreen navigation={navigation} />
        )}
    </>
  );
};

export default HomeScreen;
