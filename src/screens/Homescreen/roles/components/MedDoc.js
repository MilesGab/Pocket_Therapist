import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { useUserContext } from '../../../../../contexts/UserContext';


const MedDoc = () => {
  const { userData } = useUserContext();
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);

  const [reqMCEmail, setMCReqemail] = useState('');
  const [reqMCNote, setMCReqnote] = useState('');
  const [reqLREmail, setLRReqemail] = useState('');
  const [reqLRNote, setLRReqnote] = useState('');
  const [reqMPEmail, setMPReqemail] = useState('');
  const [reqMPNote, setMPReqnote] = useState('');

  const [uploadSuccessMC, setUploadSuccessMC] = useState(false);
  const [uploadFailMC, setUploadFailMC] = useState(false);
  const [uploadSuccessLR, setUploadSuccessLR] = useState(false);
  const [uploadFailLR, setUploadFailLR] = useState(false);
  const [uploadSuccessMP, setUploadSuccessMP] = useState(false);
  const [uploadFailMP, setUploadFailMP] = useState(false);

  const MChandleRequest = async () => {
    try {

      if (userData?.firstName && userData?.lastName) {
        const firstName = userData.firstName;
        const lastName = userData.lastName;
        const suffix = '_REQUEST_MC';
      
        const documentTitle = `${firstName}_${lastName}${suffix}`;
      
        const docRef = firestore().collection('medDocuRequest');
      
        await docRef.add({
          createdAt: firestore.FieldValue.serverTimestamp(),
          email: reqMCEmail,
          note: reqMCNote,
          type: 'medical_certificate',
          patient: userData.uid
        });
  
        console.log('Document saved successfully');
        setMCReqemail('');
        setMCReqnote('');
        setShowModal1(false);
        setUploadSuccessMC(true);
        setTimeout(() => {
          setUploadSuccessMC(false);
        }, 5000);
      } else {
        console.error('User data incomplete');
        setMCReqemail('');
        setMCReqnote('');
        setShowModal1(false);
        setUploadFailMC(true); 
        setTimeout(() => {
          setUploadFailMC(false);
        }, 5000); 
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const LRhandleRequest = async () => {
    try {

      if (userData?.firstName && userData?.lastName) {
        const firstName = userData.firstName;
        const lastName = userData.lastName;
        const suffix = '_REQUEST_LR';
      
        const documentTitle = `${firstName}_${lastName}${suffix}`;
      
        const docRef = firestore().collection('medDocuRequest');
      
        await docRef.add({
          createdAt: firestore.FieldValue.serverTimestamp(),
          email: reqLREmail,
          note: reqLRNote,
          type: 'laboratory_request',
          patient: userData.uid
        });
  
        console.log('Document saved successfully');
        setLRReqemail('');
        setLRReqnote('');
        setShowModal2(false);
        setUploadSuccessLR(true);
        setTimeout(() => {
          setUploadSuccessLR(false);
        }, 5000);
      } else {
        console.error('User data incomplete');
        setLRReqemail('');
        setLRReqnote('');
        setShowModal2(false);
        setUploadFailLR(true);
        setTimeout(() => {
          setUploadFailLR(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const MPhandleRequest = async () => {
    try {

      if (userData?.firstName && userData?.lastName) {
        const firstName = userData.firstName;
        const lastName = userData.lastName;
        const suffix = '_REQUEST_MP';
      
        const docRef = firestore().collection('medDocuRequest');
      
        await docRef.add({
          createdAt: firestore.FieldValue.serverTimestamp(),
          email: reqMPEmail,
          note: reqMPNote,
          type: 'medical_prescription',
          patient: userData.uid
        });
  
        console.log('Document saved successfully');
        setMPReqemail('');
        setMPReqnote('');
        setShowModal3(false);
        setUploadSuccessMP(true);
        setTimeout(() => {
          setUploadSuccessMP(false);
        }, 5000);
      } else {
        console.error('User data incomplete');
        setMPReqemail('');
        setMPReqnote('');
        setShowModal3(false);
        setUploadFailMP(true);
        setTimeout(() => {
          setUploadFailMP(false);
        }, 5000);
        
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  return (
    <View style={{padding: 12}}>
      <Text style={styles.servicesText}>Medical Documents</Text>
      <View style={{ backgroundColor: 'white', padding: 12, borderRadius: 12, elevation: 4 }}>
        <TouchableOpacity onPress={() => setShowModal1(true)} style={styles.serviceBtn}>
          <Icon name="document-text-outline" color={'#d19245'} size={36} style={{ right: 12 }} />
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', flex: 1 }}>
            Medical Certificate
          </Text>
          <Icon name="chevron-forward-outline" size={20} />
        </TouchableOpacity>
      {uploadSuccessMC && (
        <View>
        <Text style={styles.uploadSuccessText}>Medical Certificate Requested</Text>
        </View>
        )}
      {uploadFailMC && (
        <View>
        <Text style={styles.uploadFailText}>Request Failed. Please try again</Text>
        </View>
      )}
      <Divider style={{ marginVertical: 12 }} />

        <TouchableOpacity onPress={() => setShowModal2(true)} style={styles.serviceBtn}>
          <Icon name="document-text-outline" color={'#d19245'} size={36} style={{ right: 12 }} />
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', flex: 1 }}>
            Laboratory Request
          </Text>
          <Icon name="chevron-forward-outline" size={20} />
        </TouchableOpacity>
      {uploadSuccessLR && (
        <View>
        <Text style={styles.uploadSuccessText}>Laboratory Request Requested</Text>
        </View>
      )}
      {uploadFailLR && (
        <View>
        <Text style={styles.uploadFailText}>Request Failed. Please try again</Text>
        </View>
      )}
        <Divider style={{ marginVertical: 12 }} />
        <TouchableOpacity onPress={() => setShowModal3(true)} style={styles.serviceBtn}>
          <Icon name="document-text-outline" color={'#d19245'} size={36} style={{ right: 12 }} />
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black', flex: 1 }}>
            Medical Prescription
          </Text>
          <Icon name="chevron-forward-outline" size={20} />
        </TouchableOpacity>
      {uploadSuccessMP && (
        <View>
        <Text style={styles.uploadSuccessText}>Medical Prescription Requested</Text>
        </View>
      )}
      {uploadFailMP && (
        <View>
        <Text style={styles.uploadFailText}>Request Failed. Please try again</Text>
        </View>
      )}
      </View>


      <Modal visible={showModal1} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Medical Certificate</Text>
            <Text>Note: This is the email address the document will be sent</Text>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              onChangeText={(text) => setMCReqemail(text)}
              value={reqMCEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Note to doctor"
              onChangeText={(text) => setMCReqnote(text)}
              value={reqMCNote}
            />
            <TouchableOpacity style={styles.requestButton} onPress={MChandleRequest}>
              <Text style={styles.requestButtonText}>Request</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal1(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showModal2} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Medical Certificate</Text>
            <Text>Note: This is the email address the document will be sent</Text>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              onChangeText={(text) => setLRReqemail(text)}
              value={reqLREmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Note to doctor"
              onChangeText={(text) => setLRReqnote(text)}
              value={reqLRNote}
            />
            <TouchableOpacity style={styles.requestButton} onPress={LRhandleRequest}>
              <Text style={styles.requestButtonText}>Request</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal2(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showModal3} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Medical Document</Text>
            <Text>Note: This is the email address the document will be sent</Text>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              onChangeText={(text) => setMPReqemail(text)}
              value={reqMPEmail}
            />
      
            <TextInput
              style={styles.input}
              placeholder="Note to doctor"
              onChangeText={(text) => setMPReqnote(text)}
              value={reqMPNote}
            />
            <TouchableOpacity style={styles.requestButton} onPress={MPhandleRequest}>
              <Text style={styles.requestButtonText}>Request</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowModal3(false)}>
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
    fontSize: 26,
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

export default MedDoc;
