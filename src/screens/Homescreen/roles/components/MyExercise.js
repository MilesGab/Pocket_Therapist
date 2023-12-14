import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import { ActivityIndicator, Avatar } from "@react-native-material/core";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const MyExercises = ({ route }) => {
    const { patientData } = route.params;
    const navigation = useNavigation();
    const [videos, setVideos] = React.useState([]);
    const [isLoading, setLoading] = React.useState(true);
    const [paused, setPaused] = React.useState(true);
    const [selectedVideos, setSelectedVideos] = React.useState({});
  
    React.useEffect(() => {
      const fetchVideoDetails = async () => {
        try {
          const snapshot = await firestore().collection('exerciseVids').get();
          const videoData = snapshot.docs.map(doc => doc.data());
      
          if (videoData) {
            // Filter videos based on patient_access including patient id
            const filteredVideos = videoData.filter(video => video.patient_access && video.patient_access.includes(patientData));

            setVideos(filteredVideos);
          }
        } catch (error) {
          console.error('Error fetching video details from the database:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchVideoDetails();
    }, []);

    const renderVideo = ({ item }) => {
      return (
          <TouchableOpacity style={styles.videoContainer}>
            <Text style={styles.videoTitle}>{item.video_name}</Text>
            <Text style={{color:'black'}}>{item.video_description}</Text>
            <Video
              source={{ uri: item.video_path }}
              style={styles.videoPlayer}
              controls={true}
              resizeMode="contain"
              paused={paused}
            />
          </TouchableOpacity>
      );
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.heading}>
          <TouchableOpacity onPress={()=>navigation.goBack()} style={{display:'flex', flexDirection:'row', alignContent:'center', alignItems:'center'}}>
            <Icon name="chevron-back-outline" color="black"/>
            <Text style={{color:'black'}}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headingTxt}>Exercises</Text>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color='#CEDDF7' style={styles.loading} />
        ) : videos.length > 0 ? (
          <FlatList
            style={styles.vidlist}
            data={videos}
            keyExtractor={(item) => item.video_id.toString()}
            renderItem={renderVideo}
          />
        ) : (
          <View style={styles.noExercisesContainer}>
            <Icon name="accessibility-outline" color={'black'} size={36} />
            <Text style={styles.noExercisesText}>No Exercises Available</Text>
          </View>
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
        paddingLeft: 20,
        display:'flex',
        flexDirection:'row',
        alignContent:'center',
        alignItems:'center',
        gap: 12
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
      },

      noExercisesContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height:'100%'
      },
      
      noExercisesText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
      },
});

export default MyExercises;
