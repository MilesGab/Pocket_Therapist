import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import { ActivityIndicator, Avatar } from "@react-native-material/core";

const Exercises = ({ route }) => {
  const { patientData } = route.params;
  const [videos, setVideos] = useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [paused, setPaused] = useState(true);
  const [selectedVideos, setSelectedVideos] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [otherVideos, setOtherVideos] = useState([]);

  const fetchVideoDetails = async () => {
    try {
      const snapshot = await firestore().collection('exerciseVids').get();
      const videoData = snapshot.docs.map(doc => doc.data());
  
      if (videoData) {
        // Filter videos based on patient_access including patient id
        const filteredVideos = videoData.filter(video => video.patient_access && video.patient_access.includes(patientData));
        setVideos(filteredVideos);

        // Filter videos that do not include patientData
        const otherVideos = videoData.filter(video => !video.patient_access || !video.patient_access.includes(patientData));
        setOtherVideos(otherVideos);

      const initialSelectedVideos = filteredVideos.reduce((acc, video) => {
        acc[video.video_id] = true;
        return acc;
      }, {});

      setSelectedVideos(initialSelectedVideos);
      }
    } catch (error) {
    } finally {
      console.log('Videos accessed: ', videos);
      console.log('Videos not accessed: ', otherVideos);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoDetails();
  }, []);

  const toggleCheckbox = (videoId) => {
    setSelectedVideos(prevState => ({
      ...prevState,
      [videoId]: !prevState[videoId],
    }));
  };

  useEffect(()=>{
    console.log(selectedVideos);
  },[selectedVideos]);

  const renderVideo = ({ item }) => {
    return (
      <View style={{display:'flex', flexDirection:'row'}}>
        {editMode ? (
          <BouncyCheckbox
            isChecked={selectedVideos[item.video_id]}
            onPress={() => toggleCheckbox(item.video_id)}
          />
        ) : (null)
        }
        <TouchableOpacity style={styles.videoContainer}>
          <Text style={styles.videoTitle}>{item.video_name}</Text>
          {/* <Video
            source={{ uri: item.video_path }}
            style={styles.videoPlayer}
            controls={true}
            resizeMode="contain"
            paused={paused}
          /> */}
        </TouchableOpacity>
      </View>
    );
  };

const handlePress = async () => {
  try {
    const updatedVideos = Object.entries(selectedVideos)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);

    const deletedAccess = Object.entries(selectedVideos)
      .filter(([key, value]) => value === false)
      .map(([key]) => key);

    const videosToUpdate = updatedVideos.map(async video => {
      const videoRef = firestore().collection('exerciseVids').doc(video);
      const videoDoc = await videoRef.get();
      if (videoDoc.exists) {
        const patientAccess = videoDoc.data().patient_access || [];

        if (!patientAccess.includes(patientData)) {
          patientAccess.push(patientData);
          await videoRef.update({ patient_access: patientAccess });
        }
      }
    });

    const videosToRemoveAccess = deletedAccess.map(async video => {
      const videoRef = firestore().collection('exerciseVids').doc(video);
      const videoDoc = await videoRef.get();
      if (videoDoc.exists) {
        const patientAccess = videoDoc.data().patient_access || [];

        const updatedPatientAccess = patientAccess.filter(patient => patient !== patientData);
        await videoRef.update({ patient_access: updatedPatientAccess });
      }
    });

    await Promise.all([...videosToUpdate, ...videosToRemoveAccess]);

    console.log('Successfully updated access to the following videos: ', updatedVideos);
  } catch (error) {
  }
};


  const toggleEdit = () => {
    setEditMode(!editMode);
    fetchVideoDetails();
  }

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={[styles.headingTxt, {flex:1}]}>Exercises</Text>
        <TouchableOpacity onPress={toggleEdit}>
        {editMode ? (
          <Text style={[styles.headingTxt, {fontSize: 12, alignContent:'center', fontWeight:'normal', color:'orange'}]}>Cancel</Text>
        ) : (
          <Text style={[styles.headingTxt, {fontSize: 12, alignContent:'center', fontWeight:'normal', color:'orange'}]}>Edit</Text>
        )}
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color='#CEDDF7' style={styles.loading} />
      ) : (
        <FlatList
          style={styles.vidlist}
          data={editMode ? [...otherVideos, ...videos] : videos}
          keyExtractor={(item) => item.video_id.toString()}
          renderItem={renderVideo}
        />
      )}
      {editMode ? (
      <Button title="Confirm Changes" onPress={handlePress} />
      ) : (
        null
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  vidlist: {
    padding: 20
  },

  heading: {
    paddingTop: 30,
    paddingHorizontal: 20,
    display:'flex',
    flexDirection:'row'
  },

  headingTxt: {
    fontSize: 30,
    fontWeight: '600',
    color: 'black'
  },
  videoContainer: {
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
  },
  videoTitle: {
    color: "gray",
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 10,
  },
  loading: {
    paddingTop: 300
  }
});

export default Exercises;