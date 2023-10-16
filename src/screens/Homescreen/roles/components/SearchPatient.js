import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { Searchbar, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from '@react-native-material/core';
import firestore from '@react-native-firebase/firestore';
import { useUserContext } from '../../../../../contexts/UserContext';

const SearchResult = ({ result, doctorId, updateDoctorField}) => {

    const handleAdd = () => {
        updateDoctorField(result?.uid);
        ToastAndroid.show('Patient has been added!', ToastAndroid.SHORT);
    }

    return(
        <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignContent:'center', alignItems:'center', marginBottom: 20}}>
            <TouchableOpacity>
                <View style={{display:'flex', flexDirection:'row', alignContent:'center', alignItems:'center'}}>
                    <Avatar 
                        style={{marginRight: 12}} 
                        image={{ uri: result?.profilePictureURL || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                        }}/>
                    <Text style={{fontSize: 18, color:'black'}}>{result?.name || result?.firstName} {result?.lastName}</Text>
                </View>
            </TouchableOpacity>
            { result?.doctor === doctorId ? (
                <View style={{backgroundColor: 'rgba(197,216,234,0.80)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16}}>
                    <Text style={{color: 'rgba(54,139,217,0.90)'}}>ADDED</Text>
                </View>
            ) : (
                <TouchableOpacity onPress={handleAdd} style={{backgroundColor: 'rgba(54,139,217,0.80)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16}}>
                    <Text style={{color: 'white'}}>ADD</Text>
                </TouchableOpacity>
            )}
            
        </View>
    )

}

const PatientSearch = () => {

    const { userData, updateUser } = useUserContext();
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [resultsList, setResultsList] = React.useState([]);

    const trimmedUid = userData.uid.trim();

    const onChangeSearch = (query) => {
        setSearchQuery(query);
    }

    const handleCancel = () => {
        navigation.navigate('DoctorHomescreen');
    }

    const searchPatient = async () => {
        try {
            const querySnapshot = await firestore()
                .collection('users')
                .where('role', '==', 0)
                .get();
    
            const resultsArray = [];
    
            querySnapshot.forEach((documentSnapshot) => {
                const data = documentSnapshot.data();
                resultsArray.push(data);
            });
    
            setResultsList(resultsArray);
        } catch (error) {
            console.error('Error fetching patient list: ', error);
        } finally {
        }
    }

    const updateDoctorField = async (userUid) => {
        try {
            const userRef = firestore().collection('users').doc(userUid);
    
            await userRef.update({
                doctor: trimmedUid
            });
    
            console.log(`Doctor field updated for user with UID: ${userUid}`);
        } catch (error) {
            console.error('Error updating doctor field: ', error);
        } finally{
            searchPatient();
        }
    };

    React.useEffect(()=>{
        searchPatient();
    },[searchQuery])

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Searchbar
                    placeholder="Search for Patients..."
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    style={{ width: '85%' }}
                />
                <TouchableOpacity onPress={handleCancel}>
                    <Text style={{fontSize: 18, color:"black"}}>Cancel</Text>
                </TouchableOpacity>
            </View>
            <View>
            {resultsList
            .filter(result => result?.firstName?.toLowerCase().startsWith(searchQuery.toLowerCase()))
            .map((result, index) => (
                <SearchResult key={index} result={result} doctorId={trimmedUid} updateDoctorField={updateDoctorField}/>
            ))}
            </View>
        </View>
    )

}

const styles = StyleSheet.create({

  container:{
    padding: 20
  },

  header:{
    display:'flex',
    flexDirection:'row',
    width:'100%',
    alignItems:'center',
    gap: 6,
    marginBottom: 20
  }

})


export default PatientSearch;