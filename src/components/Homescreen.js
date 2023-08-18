import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View id="header" style={styles.header}>
        <Text style={styles.headerText}>👋 Hello!</Text>
        <Text style={{fontSize: 32, color: 'black'}}>Mico Ruiz D. Linco</Text>
      </View>
      <View id="services" style={styles.content}>
        <Text style={styles.contentText}>Services</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.iconButton}/>
                <TouchableOpacity style={styles.iconButton}/>
                <TouchableOpacity style={styles.iconButton}/>
                <TouchableOpacity style={styles.iconButton}/>
            </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2023 My App. All rights reserved.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  header: {
    paddingTop: 5,
    marginBottom: 32
  },
  headerText: {
    color: 'black',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '500'
  },
  content: {
    flex: 1,
    alignContent: 'left',
  },
  contentText: {
    color: 'black',
    fontSize: 24,
    textAlign: 'left',
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconButton: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 16,
    width: 80,
    height: 80
  },
  footer: {
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12
  },
});

export default HomeScreen;
