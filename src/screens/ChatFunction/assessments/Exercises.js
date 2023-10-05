import React, {useState, useEffect}from 'react';
import { View, Text, FlatList, Video, StyleSheet} from 'react-native';
import { getDownloadURL } from 'firebase/storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Exercises = () => {
    const [video, setVideo] = useState([]);

    useEffect(() => {
        const fetchVideoUrls = async () => {
            const videoUrls = await getVideoUrls();
            setVideo(videoUrls);
        };

        fetchVideoUrls();
    },[]);

    const getVideoUrlFromFirebase = async () =>{

    };

    const renderVideo = async ({item}) => {
        return(

        <TouchableOpacity style={styles.video}>
            <Text style={styles.videoTitle}>{item.title}</Text>
            <Video
                source={{uri: item.url}}
                style={styles.player}
                controls={true}
            />
            </TouchableOpacity>
        );
    };

    return(

        <View style={styles.container}>
            <FlatList
            data={video}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderVideo}
            />
        </View>
    );
};


const styles = StyleSheet.create({

    container:{
        flex: 1,
        padding: 16
    }

})

export default Exercises;