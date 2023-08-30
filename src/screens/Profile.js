import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Profile = () => {
  return (
    <View style={styles.container}>
      <View id="header">
        <Text style={{fontSize: 32, color: 'black'}}>Mico Ruiz D. Linco</Text>
        <Text style={{fontSize: 32, color: 'black'}}>Student at Mapua University</Text>
      </View>
      <View id="services">
        <Text>Services</Text>
            <View>
            </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C6BA4',
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
});

export default Profile;
