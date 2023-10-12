import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import { ActivityIndicator, Avatar } from "@react-native-material/core";

const Exercises = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [paused, setPaused] = useState(true);
  const [selectedVideos, setSelectedVideos] = useState({});

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const snapshot = await firestore().collection('exerciseVids').get();
        const videoData = snapshot.docs.map(doc => doc.data());

        if (videoData) {
          setVideos(videoData);
        }
      } catch (error) {
        console.error('Error fetching video details from the database:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, []);

  const toggleCheckbox = (videoId) => {
    setSelectedVideos(prevState => ({
      ...prevState,
      [videoId]: !prevState[videoId],
    }));
  };

  const renderVideo = ({ item }) => {
    return (
      <View>
      <BouncyCheckbox
          value={!!selectedVideos[item.id]}
          onPress={() => toggleCheckbox(item.id)}
      />
        <TouchableOpacity style={styles.videoContainer}>
          <Text style={styles.videoTitle}>{item.video_name}</Text>
          <Text>{item.video_description}</Text>
          <Video
            source={{ uri: item.video_path }}
            style={styles.videoPlayer}
            controls={true}
            resizeMode="contain"
            paused={paused}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const handlePress = () => {
    console.log('Button clicked!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.headingTxt}>Exercises</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color='#CEDDF7' style={styles.loading} />
      ) : (
        <FlatList
          style={styles.vidlist}
          data={videos}
          keyExtractor={(item) => item.video_id.toString()}
          renderItem={renderVideo}
        />
      )}
      <Button title="Click me" onPress={handlePress} />
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
    paddingLeft: 20
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
