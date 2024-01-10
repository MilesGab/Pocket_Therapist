import React, { useRef, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, PanResponder, Dimensions, Text } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';

const ExercisePlayer = ({ route }) => {
    const { videodata } = route.params;
    const [paused, setPaused] = useState(true);
    const [isVisible, setVisibility] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoPlayerRef = useRef(null);

    const onProgress = (data) => {
        setCurrentTime(data.currentTime);
    };

    const onLoad = (data) => {
        setDuration(data.duration);
    };

    const skipTime = (delta) => {
        const newTime = Math.max(currentTime + delta, 0);
        videoPlayerRef.current.seek(newTime);
    };

    const handlePanResponderGrant = (e, gestureState) => {
        const newTime = (gestureState.x0 / Dimensions.get('window').width) * duration;
        videoPlayerRef.current.seek(newTime);
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: handlePanResponderGrant,
    });

    return (
        <View style={styles.container}>
            <View style={{ display: 'flex', flexDirection: 'column' }}>
                <TouchableOpacity onPress={() => setVisibility(!isVisible)}>
                    <Video
                        ref={videoPlayerRef}
                        source={{ uri: videodata.video_path }}
                        style={styles.videoPlayer}
                        controls={false}
                        resizeMode="contain"
                        paused={paused}
                        onProgress={onProgress}
                        onLoad={onLoad}
                    />
                    <View onPress={() => setVisibility(false)} style={{
                        width: '100%',
                        height: '100%',
                        display: isVisible ? 'flex' : 'none',
                        position: 'absolute',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderRadius: 20,
                        justifyContent: 'space-between', 
                        padding: 12
                    }}
                    >
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', top: 80}}>
                            <TouchableOpacity onPress={() => skipTime(-5)}>
                                <Icon name="play-back-outline" size={32} color={'#fff'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setPaused(!paused)}>
                                {!paused ? <Icon name="pause-outline" size={32} color={'#fff'} /> : <Icon name="play-outline" size={32} color={'#fff'} />}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => skipTime(5)}>
                                <Icon name="play-forward-outline" size={32} color={'#fff'} />
                            </TouchableOpacity>
                        </View>
                        <View style={{display:'flex', flexDirection:'row'}}>
                            <View style={styles.progressBarContainer} {...panResponder.panHandlers}>
                                <View style={[styles.progressBar, { width: `${(currentTime / duration) * 100}%` }]} />
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <Text style={styles.videoTitle}>{videodata.video_name || '---'}</Text>
            <Text style={styles.videoDescription}>{videodata.video_description || '---'}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    videoPlayer: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 20,
    },
    progressBarContainer: {
        width: '100%',
        height: 5,
        backgroundColor: '#ddd',
        marginTop: 20,
    },
    progressBar: {
        height: '100%',
        backgroundColor: 'rgba(65, 105, 225,1)',
    },
    videoTitle: {
        color: '#696969',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    videoDescription: {
        color: '#696969',
        fontSize: 16,
        fontWeight: 'normal',
        marginTop: 10,
    },
});

export default ExercisePlayer;
