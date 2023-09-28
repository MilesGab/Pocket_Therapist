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
      
      <BlurView
        style={{
          width:'70%',
          height: 200,
          alignItems: 'center',
          paddingVertical: 16,
          marginVertical: 12, // Replaced rowGap with marginVertical
        }}
        blurType="light"
      >
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
        
        <Text style={{fontSize: 12}}>Uploading...</Text>
        
        <View 
          style={{ 
            height: 1,
            borderWidth: StyleSheet.hairlineWidth,
            width: "100%",
            borderColor: "black"
          }}
        />
        
        <TouchableOpacity>
          <Text style={{fontSize: 15, fontWeight: '500', color:'#3478f6'}}>Cancel</Text>
        </TouchableOpacity>
      </BlurView>
    </View>
  )
}

const styles = StyleSheet.create({

})
