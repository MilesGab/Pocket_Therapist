import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker'
import firestore from '@react-native-firebase/firestore';
import { useUserContext } from '../../../../../contexts/UserContext';

const UploadDocu = ({ navigation, trimmedUid }) => {
  const { userData } = useUserContext();
  const [showModal1, setShowModal1] = useState(false);

  const handleUploadDocument = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.allFiles,
      });

      if (userData?.firstName && userData?.lastName) {


        const documentTitle = `Document`;

        const docRef = firestore().collection('medDocuRequest').doc(documentTitle);

        await docRef.set({
          documentUrl: res.uri, // You may want to store the URL or other relevant data
          // Add other fields as needed for the document
        });

        console.log('Document saved successfully');
        setShowModal1(false);
      } else {
        console.error('User data incomplete');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  return (
    <View style={{ backgroundColor: 'white', padding: 12, borderRadius: 12, elevation: 4 }}>
      <Text style={styles.servicesText}>Upload Medical Document</Text>
      <View style={{ backgroundColor: 'white', padding: 12, borderRadius: 12, elevation: 4 }}>
        <TouchableOpacity onPress={() => setShowModal1(true)} style={styles.serviceBtn}>
          <Icon name="document-text-outline" color={'#d19245'} size={36} style={{ right: 12 }} />
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', flex: 1 }}>
            Laboratory Result
          </Text>
          <Icon name="chevron-forward-outline" size={20} />
        </TouchableOpacity>
      </View>

      <Modal visible={showModal1} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submit Medical Document</Text>
            <TouchableOpacity style={styles.requestButton} onPress={handleUploadDocument}>
              <Text style={styles.requestButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal1(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  servicesText: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    color: '#343434',
    fontStyle: 'normal',
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 40,
  },
  serviceBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  requestButton: {
    backgroundColor: '#d19245',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  requestButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default UploadDocu;