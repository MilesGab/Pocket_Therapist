import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, Linking, Modal } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageViewer from 'react-native-image-zoom-viewer';

const ViewUploaded = ({ route }) => {
  const { fileData } = route.params;
  const [list, setList] = React.useState([]);
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imagesForViewer = list.filter(item => item.type === 'img').map(item => ({ url: item.file_path }));

  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setImageViewerVisible(true);
  };


  React.useEffect(() => {
    if (fileData) {
      fetchUploadedData(fileData);
    }
  }, [fileData]);
  
  const fetchUploadedData = async (ticketId) => {
    try {
      const patientDataRef = firestore().collection('uploadedDocuments').where('ticket', '==', ticketId);
      const querySnapshot = await patientDataRef.get();
  
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      if (documents.length > 0) {
        setList(documents);
      } else {
        console.log('No matching documents found');
      }
    } catch (error) {
    }
  };
  
  const openDocumentInBrowser = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        {list.length > 0 ? (
          <>
          {list.map((item, index) => (
            <View key={item.id}>
              {item.type === 'img' ? (
                <View>
                  <Text style={{color: '#000', fontWeight: 'bold', fontSize: 20, marginBottom: 12}}>Uploaded Image</Text>
                  <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={() => openImageViewer(index)}>
                      <Image source={{ uri: item.file_path }} style={styles.image} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) :
              (
                <View style={{marginBottom: 12}}>
                  <Text style={{color: '#000', fontWeight: 'bold', fontSize: 20, marginBottom: 12}}>Uploaded Document</Text>
                  <TouchableOpacity 
                    onPress={()=>openDocumentInBrowser(item.file_path)}
                    style={{
                      width:'100%',
                      backgroundColor: '#fff',
                      paddingVertical: 12,
                      padding: 6,
                      borderRadius: 4,
                      display:'flex',
                      flexDirection:'row',
                      alignItems:'center',
                      gap: 4
                    }}
                  >
                    <Icon name="document-text-outline" size={24} style={{color:'#000'}}/>
                    <Text style={{color: '#000', fontSize: 18, fontWeight: 'bold'}}>{item.file_name}</Text>
                  </TouchableOpacity>

                </View>
              )}
            </View>
          ))}
          </>

        ) : (
          <Text>Nothing to show!</Text>
        )}

      </View>

      <Modal 
        visible={isImageViewerVisible} 
        transparent={true}
        onRequestClose={() => {
          setImageViewerVisible(false)
        }}
      >
        <ImageViewer 
          imageUrls={imagesForViewer}
          index={currentImageIndex}
          onSwipeDown={() => setImageViewerVisible(false)}
          enableSwipeDown={true}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 20
  },

  imageContainer: {
    alignItems: 'center',
    marginBottom: 12
  },

  image: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').width,
    resizeMode: 'contain',
    borderRadius: 12
  },
});

export default ViewUploaded;
