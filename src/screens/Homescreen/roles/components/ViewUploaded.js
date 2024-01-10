import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ViewUploaded = ({ route }) => {
  const { patientData } = route.params;
  const [uploadedImgURL, setUploadedImgURL] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patientData) {
      fetchUploadedData(patientData);
    }
  }, [patientData]);

  const fetchUploadedData = async (patientId) => {
    try {
      const patientDataRef = firestore().collection('users').doc(patientId);
      const patientDoc = await patientDataRef.get();

      if (patientDoc.exists) {
        const patientData = patientDoc.data();
        if (patientData.uploadedImg) {
          setUploadedImgURL(patientData.uploadedImg);
        }
        setLoading(false);
      } else {
        console.error('Patient data not found');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.imageContainer}>
        <Text style={styles.title}>Uploaded Image:</Text>
        {uploadedImgURL ? (
          <Image source={{ uri: uploadedImgURL }} style={styles.image} />
        ) : (
          <Text style={{ color: 'black' }}>No image uploaded</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    color: 'black',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width - 40,
    height: 300,
    resizeMode: 'contain',
  },
});

export default ViewUploaded;
