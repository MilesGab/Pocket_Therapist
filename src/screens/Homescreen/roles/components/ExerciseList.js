import React from 'react';
import { View, Text, FlatList, StyleSheet, Button, Image } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import { ActivityIndicator, Avatar } from "@react-native-material/core";
import { useNavigation } from '@react-navigation/native';

const ExerciseList = () => {
  const [videos, setVideos] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [paused, setPaused] = React.useState(true);
  const [selectedVideos, setSelectedVideos] = React.useState({});

  const navigation = useNavigation();

  React.useEffect(() => {
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

    return () => {
      setPaused(true);
    };
  }, []);

  const toggleCheckbox = (videoId) => {
    setSelectedVideos(prevState => ({
      ...prevState,
      [videoId]: !prevState[videoId],
    }));
  };

  const handleVideo = (item) => {
    navigation.navigate('ExercisePlayer', {videodata: item});
  }

  const renderVideo = ({ item }) => {
    return (
      <TouchableOpacity onPress={()=>handleVideo(item)} style={styles.videoContainer}>
      <View style={{display:'flex', flexDirection:'row',gap: 12}}>
              <Image source={item?.thumbnail ? { uri: item?.thumbnail } : require('../../../../../assets/images/default.png')}
              color='#CEDDF7'
              style={{
              width: 100,
              height: 100,
              borderRadius: 16
              }}
              />
              <View>
                <Text style={styles.videoTitle}>{item.video_name}</Text>
              </View>
            </View>
        {/* <Video
          source={{ uri: item.video_path }}
          style={styles.videoPlayer}
          controls={true}
          resizeMode="contain"
          paused={paused}
        /> */}
      </TouchableOpacity>
    );
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
          scrollEnabled={true}
          style={styles.vidlist}
          data={videos}
          keyExtractor={(item) => item.video_id.toString()}
          renderItem={renderVideo}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

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
    borderRadius: 20,
    padding: 10,
    elevation: 4
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'black'
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 20,
  },
  loading: {
    paddingTop: 300
  }
});

export default ExerciseList;
