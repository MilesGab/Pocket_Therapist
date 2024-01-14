import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, Linking } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Box } from "@react-native-material/core";
import { Divider } from 'react-native-paper';


const ViewUploaded = ({ route }) => {
  const { patientData } = route.params;
  const [uploadedImgURL, setUploadedImgURL] = React.useState('');
  const [uploadedDocuURL, setUploadedDocuURL] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [patientInfo, setPatientInfo] = React.useState([]);

  React.useEffect(() => {
    if (patientData) {
      fetchUploadedData(patientData);
      setPatientInfo(patientInfo)
    }
  }, [patientData]);
  
  const fetchUploadedData = async (patientId) => {
    try {
      const patientDataRef = firestore().collection('users').doc(patientId);
      const patientDoc = await patientDataRef.get();
  
      if (patientDoc.exists) {
        const patientData = patientDoc.data();
        console.log(patientData);
        if (patientData.uploadedImgURL) {
          setUploadedImgURL(patientData.uploadedImgURL);
        }
  
        if (patientData.uploadedDocuURL) {
          setUploadedDocuURL(patientData.uploadedDocuURL);
        }

        setPatientInfo(patientData);
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
  
    const openDocumentInBrowser = () => {
      if (uploadedDocuURL) {
        Linking.openURL(uploadedDocuURL);
      }
    };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <View style={styles.header}>
          <View>
            <Text style={{
              fontFamily: 'Nunito Sans', 
              fontSize: 28, 
              color: 'black', 
              fontWeight: 'bold',
              paddingBottom:20,
              alignSelf:'center'}}>{patientInfo.firstName}{patientInfo.lastName}</Text>
          </View>
        </View>

          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <>
              {uploadedImgURL ? (
              <>
                <Text style={styles.title1}>Uploaded Image</Text>
                  <Box style={styles.boxStyle}>
                      <View style={styles.imageContainer}>
                        <Image source={{ uri: uploadedImgURL }} style={styles.image} />
                      </View>
                  </Box>
              </>
              ) : (
                <Box style={styles.noDataTextBox}>
                  <Text style={styles.noDataText}>No uploaded image</Text>
                </Box>
              )}
            </>
          )}

        {uploadedDocuURL ? (
        <>
          <Text style={styles.title1}>Uploaded Document</Text>
            <Box style={styles.boxStyle}>
              <Text style={{ padding: 10, color: 'black' }}>
                To view the patient's uploaded document, press the "Uploaded Document" button. The document will open in a browser
              </Text>
              <Divider />
              <TouchableOpacity onPress={openDocumentInBrowser}>
                <Text style={styles.title2}>Uploaded Document</Text>
              </TouchableOpacity>
            </Box>
        </>
        ) : (
          <Box style={styles.noDataTextBox}>
            <Text style={styles.noDataText}>No uploaded document</Text>
          </Box>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
  },

  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop:40,
    alignSelf:'flex-start'
  },

  noDataText: {
    padding: 10,
    alignSelf: 'center',
    color: 'red', // Change the color or add any other style for "no image available" and "no document available"
  },
  noDataTextBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 4,
    marginBottom: 20,

  },

  headerText: {
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    color: '#343434',
    fontStyle: 'normal',
    fontWeight: 'bold',
    alignSelf:'flex-start'
  },

  title1: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    color: '#343434',
    fontStyle: 'normal',
    fontWeight: 'bold', 
    paddingBottom: 12
  },

  title2: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    color: 'green',
    fontStyle: 'normal',
    fontWeight: 'bold', 
    alignSelf:'center',
    paddingTop: 20,   
    marginBottom: 12
  },

  imageContainer: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
  },

  image: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').width,
    resizeMode: 'contain',
  },

  boxStyle: {
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 4,
    marginBottom: 20,
  },
  
  documentBox: {

    paddingTop: 10,
    marginBottom: 20,
  },
});

export default ViewUploaded;
