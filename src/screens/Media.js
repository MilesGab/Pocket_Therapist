import React, { useState } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video'
import storage from '@react-native-firebase/storage';

const Media = () => {
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  //For images

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo'
    });

    if (!result.didCancel){
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    
    setUploading(true);

    try{
      await storage().ref(filename).putFile(uploadUri);
      setUploading(false);
      Alert.alert('Image upload success!');
    } catch (e) {
      console.log(e);
    }
      setImage(null);
  }

    //For videos

    const pickVideo = async () => {
      let result = await ImagePicker.launchImageLibrary({
        mediaType: 'video',
      });
  
      if (!result.didCancel){
        setVideo(result.assets[0].uri);
      }
    };
  
    const uploadVideo = async () => {
      const uploadUri = video;
      let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
      
      setUploading(true);
  
      try{
        await storage().ref(filename).putFile(uploadUri);
        setUploading(false);
        Alert.alert('Video upload success!');
      } catch (e) {
        console.log(e);
      }
        setVideo(null);
    }

    const unselectImage = () => {
      setImage(null);
    };

    const unselectVideo = () => {
      setVideo(null);
    };
  

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        {video && <Video source={{ uri: video }} style={{ width: 200, height: 200 }} />}
    
        {!video && <Button title="Select Image" onPress={pickImage} />}
        {!image && <Button title="Select Video" onPress={pickVideo} />}
    
        <Button title="Upload Image" onPress={uploadImage} disabled={!image || uploading} />
        <Button title="Upload Video" onPress={uploadVideo} disabled={!video || uploading} />
    
        {image && <Button title="Unselect Image" onPress={unselectImage} />}
        {video && <Button title="Unselect Video" onPress={unselectVideo} />}
      </View>
    );
  }

export default Media;