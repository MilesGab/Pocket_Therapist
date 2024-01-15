import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { useUserContext } from '../../../../../contexts/UserContext';
import { Divider } from '@react-native-material/core';

const UploadDocu = () => {

  const { userData } = useUserContext();

  const [showModal1, setShowModal1] = useState(false);
  const [imgUploadSuccess, setImgUploadSuccess] = useState(false);
  const [imgUploadFail, setImgUploadFail] = useState(false);
  const [docuUploadSuccess, setDocuUploadSuccess] = useState(false);
  const [docuUploadFail, setDocuUploadFail] = useState(false);
  const [list, setList] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const trimmedUid = userData?.uid.trim();

  const handleModelOpen = (item) => {
    setSelectedTicket(item);
    setShowModal1(true);
  }

  const handleModalClose = () => {
    setSelectedTicket(null);
    setShowModal1(false);
  }

  const fetchTickets = async () =>{
    try{

      const ticketRef = firestore().collection("tickets").where("patient", '==', trimmedUid);
      const querySnapshot = await ticketRef.get();
  
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      if (documents.length > 0) {
        setList(documents);
      } else {
        console.log('No matching documents found');
      }

    } catch (e){
      console.error('Error fetching tickets: ', e);
    }
  };

  React.useEffect(()=>{
    fetchTickets();
  },[]);

  const handleImgUpload = async (docId) => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: DocumentPicker.types.images,
      });
  
      const currentUser = auth().currentUser;
  
      if (currentUser) {
        const userDocRef = firestore().collection('users').doc(currentUser.uid);
        const userDoc = await userDocRef.get();
  
        if (userDoc.exists) {
          const userData = userDoc.data();
          const fileName = `${userData.firstName}_${userData.lastName}_IMAGE_RESULT`;
  
          const storageRef = storage().ref(`patientUpload/patientUploadImg/${fileName}`);
          const uploadTask = storageRef.putFile(res.uri);
  
          uploadTask.on('state_changed',
            (snapshot) => {},
            async (error) => {
              console.error('Error uploading image:', error);
            },
            async () => {
              try {
                const downloadURL = await storageRef.getDownloadURL();
  
                await userDocRef.update({
                  uploadedImgAt: firestore.FieldValue.serverTimestamp(),
                  uploadedImgURL: downloadURL,
                });
                console.log('Image uploaded successfully');
                setShowModal1(false);
                setImgUploadSuccess(true); 
                setTimeout(() => {
                  setImgUploadSuccess(false);
                }, 5000); 
              } catch (error) {
                console.error('Error getting download URL:', error);
                setShowModal1(false);
                setImgUploadFail(true); 
                setTimeout(() => {
                  setImgUploadFail(false);
                }, 5000); 
              }
            }
          );
        } else {
          console.error('User data not found');
        }
      } else {
        console.error('User data not found');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };
  

  const handleDocuUpload = async (docId) => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [
          Platform.OS === 'android'
            ? 'com.android.providers.media.MediaDocumentsProvider/*'
            : DocumentPicker.types.allFiles,
        ],
        openAction: Platform.OS === 'android' ? 'openDocument' : undefined,
      });
  
      const currentUser = auth().currentUser;
  
      if (currentUser) {
        const userDocRef = firestore().collection('users').doc(currentUser.uid);
        const userDoc = await userDocRef.get();
        const uploadRef = firestore().collection('uploadedDocuments');

        if (userDoc.exists) {
          const userData = userDoc.data();
          const fileName = `${userData.firstName}_${userData.lastName}_DOCU_RESULT`;
  
          const storageRef = storage().ref(`patientUpload/patientUploadDocu/${fileName}`);
          const uploadTask = storageRef.putFile(res.uri);
  
          uploadTask.on(
            'state_changed',
            null,
            (error) => {
              console.error('Error uploading document:', error);
            },
            async () => {
              try {
                const downloadURL = await storageRef.getDownloadURL();
  
                await uploadRef.add({
                  uploadedDocuAt: firestore.FieldValue.serverTimestamp(),
                  uploadedDocuURL: downloadURL,
                });
  
                console.log('Document uploaded successfully');
                setShowModal1(false);
                setDocuUploadSuccess(true);
                setTimeout(() => {
                  setDocuUploadSuccess(false);
                }, 5000); 
              } catch (error) {
                console.error('Error getting download URL:', error);
                setShowModal1(false);
                setDocuUploadFail(true); 
                setTimeout(() => {
                  setDocuUploadFail(false);
                }, 5000); 
              }
            }
          );
        } else {
          console.error('User data not found');
        }
      } else {
        console.error('User data not found');
      }
    } catch {
    }
  };
  

  return (
    <View style={{padding: 12}}>
      <Text style={styles.servicesText}>Upload Medical Document</Text>
      <View style={{ backgroundColor: 'white', padding: 12, borderRadius: 12, elevation: 4 }}>
        {list.length > 0 ? (
          <>
            {list.map((ticket)=>(
              <React.Fragment key={ticket.id}>
                <TouchableOpacity onPress={() => handleModelOpen(ticket)} style={styles.serviceBtn}>
                  <Icon name="document-text-outline" color={'#d19245'} size={36} style={{ right: 12 }} />
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', flex: 1 }}>
                    {ticket.name.length > 2 ? ticket.name : ticket.name.join(', ').replace(/, (?=[^,]*$)/, ' and ')}
                  </Text>
                  <Icon name="chevron-forward-outline" size={20} />
                </TouchableOpacity>
                <Divider/>
              </React.Fragment>
            ))}
          </>
        ) : (
          <Text>Loading...</Text>
        )}


      </View>

      <Modal visible={showModal1} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedTicket?.name.length > 2 ? selectedTicket?.name : selectedTicket?.name.join(', ').replace(/, (?=[^,]*$)/, ' and ')}</Text>
            <TouchableOpacity style={styles.requestButton} onPress={()=>handleImgUpload()}>
              <Text style={styles.requestButtonText}>Upload Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.requestButton} onPress={()=>handleDocuUpload(selectedTicket?.id)}>
              <Text style={styles.requestButtonText}>Upload Document</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleModalClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {imgUploadSuccess && (
          <Text style={styles.uploadSuccessText}>Image Successfully Uploaded</Text>
      )}
      {imgUploadFail && (
          <Text style={styles.uploadFailText}>Image Upload Failed. Please try again.</Text>
      )}
      {docuUploadSuccess && (
          <Text style={styles.uploadSuccessText}>Document Successfully Uploaded</Text>
      )}
      {docuUploadFail && (
          <Text style={styles.uploadFailText}>Document Upload Failed. Please try again.</Text>
      )}
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
  uploadSuccessText: {
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  uploadFailText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  serviceBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 12,
    marginBottom: 20
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
