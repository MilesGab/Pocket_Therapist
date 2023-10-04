import { Avatar } from '@react-native-material/core';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

 
const AppointmentList = () => {

    return (
        <View style={styles.notifCard}>
            <View style={styles.content}>
                <Avatar size={60} icon={<Icon name="person-circle-outline" size={60}/>} style={{marginRight: 8}}/>
                <Text style={styles.contentText}>Your appointment at October 3, 2023 at 3:00 PM has been approved by Dr. Mico Linco</Text>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    notifCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        marginBottom:12
    },

    content: {
        width:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    
    contentText: {
        width: '80%',
        color:'black'
    }
})

export default AppointmentList;