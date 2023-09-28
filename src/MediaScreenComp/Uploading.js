import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import { BlurView } from "@react-native-community/blur";
import ProgressBar from "./ProgressBar";
import Video from 'react-native-video';

{/*uploading screen not yet finished*/}

export function Uploading({ image, video, progress }) {
  return (
    <View style={[StyleSheet.absoluteFill, {alignItems:'center', justifyContent:'center', zIndex: 1,}]}>
      <BlurView 
        blurType="dark"
        style={StyleSheet.absoluteFill}
      ></BlurView>
      
      <View style={styles.box}>
        {image && (
          <Image
            source={{uri:image}}
            style={{
              width: 100,
              height: 100,
              resizeMode:'contain',
              borderRadius: 6,
            }}
          />
        )}
        {video && (
          <Video
            source={{uri:video}}
            style={{ flex: 1 }}
            resizeMode="cover"
            controls={true}
          />
        )}
        <Text style={styles.upldTxt}>Uploading...</Text>
        <ProgressBar progress={progress}/>
        <View style={styles.seperator}></View>
        
        <TouchableOpacity>
          <Text style={styles.cancelTxt}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

  box:{
    width:'70%',
    alignItems: 'center',
    paddingVertical: 16,
    marginVertical: 12, // Replaced rowGap with marginVertical
    backgroundColor: 'white',
    borderRadius: 20
  },

  upldTxt:{
    fontSize: 16,
    paddingBottom: 10,
    color: 'black',
    fontWeight: '400'
  },

  seperator:{
    height: 1,
    borderWidth: StyleSheet.hairlineWidth,
    width: "100%",
    borderColor: "black",
  },

  cancelTxt:{
    fontSize: 15, 
    fontWeight: '600', 
    color:'#3478f6',
    paddingTop: 10
  }


})
