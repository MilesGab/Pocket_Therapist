import { Divider } from '@react-native-material/core';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View, VirtualizedList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import { useUserContext } from '../../../../../contexts/UserContext';
import firestore from '@react-native-firebase/firestore';

const DiscolorationMap = {
    'NO' : 'No discoloration present',
    'YES' : 'Discoloration is present'
};
const SwellingMap = {
    'NO' : 'There is no swelling on the wrist',
    'YES' : 'There is swelling on the wrist'
};
const TemperatureMap = {
    'NO' : 'Wrist is not warm to the touch',
    'YES' : 'Wrist is warm to the touch'
};
const PainMap = {
    'NO' : 'There is no pain when pressure is applied',
    'YES' : 'Pain is present when pressure is applied'
};

const PainDurationMap = {
    'few_days' : 'Few Days',
    'few_weeks': 'Few Weeks',
    'few_months': 'Few Months',
    'several_months': 'Several Months',
    'years': 'Years',
}

const WristTable = ({ romData }) => {

    const labels = romData.map((_, index) => `・`);

    return(
        <View style={styles.tableContainer}>
            <View style={{display:'flex', flexDirection:'row', gap: 4}}>
                <Icon name="analytics-outline" size={20} color={'red'}/>
                <Text style={styles.tableText}>Range of Motion</Text>
            </View>
            <Divider style={{marginVertical: 12}}/>
            <View>
                <LineChart
                    data={{
                    labels: labels,
                    datasets: [
                        {
                        data: romData
                        }
                    ]
                    }}
                    width={330} // from react-native
                    height={220}
                    yAxisSuffix="°"
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                    backgroundColor: "#e26a00",
                    backgroundGradientFrom: "#fb8c00",
                    backgroundGradientTo: "#ffa726",
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#ffa726"
                    }
                    }}
                    bezier
                    style={{
                    marginVertical: 8,
                    borderRadius: 12
                    }}
                />
            </View>
            <Text>Data is showing last {romData.length} assessments</Text>
        </View>
    )

}

const PainTable = ({ vasData }) => {

    const labels = vasData.map((_, index) => `・`);

    return(
        <View style={styles.tableContainer}>
            <View style={{display:'flex', flexDirection:'row', gap: 4}}>
                <Icon name="contract-outline" size={20} color={'red'}/>
                <Text style={styles.tableText}>VAS Score</Text>
            </View>
            <Divider style={{marginVertical: 12}}/>
            <View>
                <LineChart
                    data={{
                    labels: labels,
                    datasets: [
                        {
                        data: vasData
                        }
                    ]
                    }}
                    width={330} // from react-native
                    height={220}
                    yAxisInterval={1} // optional, defaults to 1
                    chartConfig={{
                    backgroundColor: "#01377d",
                    backgroundGradientFrom: "#009dd1",
                    backgroundGradientTo: "#97e7f5",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: "#97e7f5"
                    }
                    }}
                    bezier
                    style={{
                    marginVertical: 8,
                    borderRadius: 12
                    }}
                />
            </View>
            <Text>Data is showing last {vasData.length} assessments</Text>
        </View>
    )

}

const AssessmentCard = ( item ) => {

    const timestamp = new Date(
        item.date.seconds * 1000 + item.date.nanoseconds / 1000000
    );
    
    const formattedDate = timestamp.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric' 
    });

    return(
        <View style={styles.displayCard}>
            <Text style={{marginBottom: 6, color:'#696969', fontWeight:'bold'}}>{formattedDate}</Text>
            <Divider color='#696969'/>
            <View>
                <View style={{marginBottom:12, gap: 12}}>
                    <View>
                        <Text style={[styles.cardText, {fontWeight:'bold'}]}>Maximum Range of Motion: {item.maxAngle}°</Text>
                    </View>

                    <View>
                        <Text style={[styles.cardText, {fontWeight:'bold'}]}>Physical Data</Text>
                        <Text style={styles.cardText}>•{DiscolorationMap[item.phyiscalData[0]]}</Text>
                        <Text style={styles.cardText}>•{SwellingMap[item.phyiscalData[1]]}</Text>
                        <Text style={styles.cardText}>•{TemperatureMap[item.phyiscalData[2]]}</Text>
                        <Text style={styles.cardText}>•{PainMap[item.phyiscalData[3]]}</Text>
                    </View>

                    <View>
                        <Text style={[styles.cardText, {fontWeight:'bold'}]}>Pain Data</Text>
                        <Text style={styles.cardText}>•Vas Score: {[item.painData[0]]}</Text>
                        <Text style={styles.cardText}>•Pain Description: {[item.painData[1]]}</Text>
                        <Text style={styles.cardText}>•Pain Duration: {PainDurationMap[item.painData[2]]}</Text>
                    </View>

                    <View>
                        <Text style={[styles.cardText, {fontWeight:'bold'}]}>Diagnosis</Text>
                        <Text style={styles.cardText}>•{item.diagnosis || '---'}</Text>
                        <Text style={[styles.cardText, {fontWeight:'bold'}]}>Notes/Recommendations</Text>
                        <Text style={styles.cardText}>•{item.notes || '---'}</Text>
                    </View>

                </View>
            </View>
        </View>
      
    );

};

const AssessmentHistory = () => {
    const { userData } = useUserContext();
    const trimmedUid = userData.uid.trim();
    const [romData, setRomData] = React.useState([1]);
    const [vasData, setVasData] = React.useState([1]);
    const [isLoading, setLoading] = React.useState(true);
    const [assessmentList, setAssessmentList] = React.useState([]);

    const navigation = useNavigation();


    const fetchPatientResults = async () => {
        try {
            const unsubscribe = firestore()
              .collection("assessments")
              .where("patient", "==", trimmedUid)
              .limit(7)
              .onSnapshot((querySnapshot) => {
                if (!querySnapshot) {
                  console.log("No data available");
                  setLoading(false);
                  return;
                }
    
                const assessments = [];
                const roms = [];
                const vas = [];
    
                querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  assessments.push(data);
                  roms.push(data.maxAngle);
                  vas.push(data.painData[0]);
                });
    
                assessments.sort((a, b) => b.date - a.date);
    
                setAssessmentList(assessments);
                setRomData(roms);
                setVasData(vas);
                setLoading(false);
              });
    
            return unsubscribe;
        } catch (error) {
            console.error('Error subscribing to assessments: ', error);
            setLoading(false);
        }
    }

    React.useEffect(()=>{
        fetchPatientResults();
    }, []);

    return(
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()} style={{display:'flex', flexDirection:'row', alignContent:'center', alignItems:'center'}}>
                    <Icon name="chevron-back-outline" color="black"/>
                    <Text style={{color:'black'}}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>Assessment History</Text>
            </View>

            <View style={styles.body}>
                {isLoading ? (
                    <ActivityIndicator size={'large'} color='gray'/>
                ) : (
                    <>
                    {/* <WristTable romData={romData}/>
                    <PainTable vasData={vasData}/> */}
                    <Text style={styles.tableText}>Last {assessmentList.length} Assessments</Text>
                
                    <FlatList
                    horizontal={false}
                    data={assessmentList}
                    keyExtractor={(item) => item.uid}
                    renderItem={({ item }) => (
                        <AssessmentCard {...item} />
                    )}
                    showsVerticalScrollIndicator={false} 
                    scrollEnabled={false}
                    />
                    </>
                )}
            </View>


        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        padding: 20,
    },

    cardText:{
        color: '#000',
    },

    header:{
        display:'flex',
        flexDirection:'row',
        alignContent:'center',
        alignItems:'center',
        gap:12,
    },

    headerText: {
        fontSize: 32, 
        color: 'black', 
        fontWeight:'bold', 
    },

    body:{
        marginVertical: 32,
        gap: 20
    },

    tableContainer:{
        backgroundColor:'white',
        padding: 20,
        borderRadius: 14,
        elevation:2
    },

    tableText:{
        color: 'black',
        fontWeight: '600',
        fontSize: 16
    },

    displayCard:{
        backgroundColor:'white',
        elevation:3,
        marginBottom: 12,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6
    }

})

export default AssessmentHistory;