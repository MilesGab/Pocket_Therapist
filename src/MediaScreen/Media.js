import React, { useState } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import { getStorage, ref, put } from 'firebase/storage';
import storage from '@react-native-firebase/storage';
import ProgressBar from './ProgressBar';
import { Uploading } from './Uploading';

const Media = () => {
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

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
        mediaType: 'video'
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
  

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Uploading/>
      <ProgressBar progress={30}/>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      {video && <Image source={{ uri: video }} style={{ width: 200, height: 200 }} />}
      <Button title="Pick Image" onPress={pickImage} />
      <Button title="Pick Video" onPress={pickVideo} />

      <Button title="Upload Image" onPress={uploadImage} disabled={!image || uploading} />
      <Button title="Upload Video" onPress={uploadVideo} disabled={!video || uploading} />

      {image && <Button title="Unselect Image" onPress={unselectImage} />}
      <Uploading/>
      <ProgressBar progress={30}/>


    </View>
  );
  }

export default Media;