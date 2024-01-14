import React from 'react';
import firestore from '@react-native-firebase/firestore';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { Box } from '@react-native-material/core';
import { useNavigation } from '@react-navigation/native';


const Tickets = ({ route }) => {
    const { patientData } = route.params;
    const [list, setList] = React.useState([]);
    const [docList, setDocList] = React.useState([]);
    const [mappedDocuments, setMappedDocuments] = React.useState({});

    const navigation = useNavigation();

    React.useEffect(() => {
        const unsubscribeTickets = firestore().collection('tickets').where('patient', '==', patientData).onSnapshot(snapshot => {
            const tickets = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setList(tickets);
        }, err => {
            console.log(`Encountered error: ${err}`);
        });

        const unsubscribeDocuments = firestore().collection('uploadedDocuments').where('patient', '==', patientData).onSnapshot(snapshot => {
            const documents = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDocList(documents);
        }, err => {
            console.log(`Encountered error: ${err}`);
        });

        return () => {
            unsubscribeTickets();
            unsubscribeDocuments();
        };
    }, []);

    React.useEffect(() => {
        const documentsMap = {};
        list.forEach(ticket => {
            documentsMap[ticket.id] = docList.filter(doc => doc.ticket === ticket.id);
        });
        setMappedDocuments(documentsMap);
    }, [list, docList]);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Documents</Text>
            <ScrollView>
                {list.map((ticket) => (
                    <View>
                        <TouchableOpacity 
                            style={styles.ticketContainer} 
                            key={ticket.id}
                            onPress={() => navigation.navigate('ViewUploaded', { fileData: ticket.uid })}
                        >
                            <Text style={styles.ticketText}>Task: {ticket.name.length > 2 ? ticket.name : ticket.name.join(', ').replace(/, (?=[^,]*$)/, ' and ')}</Text>
                            {mappedDocuments[ticket.id] && mappedDocuments[ticket.id].map(doc => (
                                <View key={doc.id} style={styles.fileContainer}>
                                    {doc.type === 'doc' ? (<Icon name='document-text-outline' size={32}/>) : (<Icon name='image-outline' size={32}/>)}
                                    <Text style={{color: '#000'}}>{doc.file_name}</Text>
                                </View>
                            ))}
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({

    container:{
        padding: 20
    },

    headerText:{
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20
    },

    ticketContainer: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 6,
        elevation: 4
    },

    fileContainer:{
        paddingHorizontal: 12,
        paddingVertical: 4,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap: 6,
        marginBottom: 12
    },

    ticketText: {
        color: '#000',
        fontSize: 16,
        fontWeight:'bold',
        marginBottom: 12
    }

});

export default Tickets;