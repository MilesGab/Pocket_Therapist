import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyC1Yia3LyR-FxtTforHbBFxgs4jUoy1K14",
  authDomain: "pocket-therapist-ddbb0.firebaseapp.com",
  projectId: "pocket-therapist-ddbb0",
  storageBucket: "pocket-therapist-ddbb0.appspot.com",
  messagingSenderId: "473959584342",
  appId: "1:473959584342:web:aa6a54e71f3761cd7521f7",
  measurementId: "G-GZ6BZSM927"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

export default firebase;