import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Avatar, IconButton, Box } from "@react-native-material/core";
import Icon from 'react-native-vector-icons/Ionicons';
import { blue } from 'react-native-reanimated';
import { FlatList, ScrollView, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useUserContext } from '../../../../contexts/UserContext';
import { QuerySnapshot } from 'firebase/firestore';
import { ActivityIndicator } from "@react-native-material/core";


const PatientScreen = ({ navigation }) => {
  const { userData, updateUser } = useUserContext();

  const [selectedId, setSelectedId] = React.useState();
  const [appointmentList, setAppointmentList] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);

  const trimmedUid = "Pkw5kI5F8tQ6MA4TP5eccSAwB503";
  //userData.uid.trim();

  React.useEffect(() => {
    setLoading(true);
    const fetchAppointments = async () => {
      try {
        const appointmentsSnapshot = await firestore()
          .collection('appointments')
          .get();

        const appointmentsData = await Promise.all(
          appointmentsSnapshot.docs.map(async doc => {
            const appointmentData = doc.data();
            const doctorSnapshot = await firestore()
              .collection('users')
              .doc(appointmentData.doctor_assigned)
              .get();
            const patientSnapshot = await firestore()
              .collection('users')
              .doc(trimmedUid)
              .get();
            
            const doctorData = doctorSnapshot.data();
            const patientData = patientSnapshot.data();
            
            return {
              ...appointmentData,
              doctorName: doctorData.lastName,
              patientName: patientData.firstName,
            };
          })
        );

        setAppointmentList(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally{
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const Item = ({item, onPress, backgroundColor, textColor}) => {
    
    const timestamp = new Date(
        item.date.seconds * 1000 + item.date.nanoseconds / 1000000
      );
    
    const formattedDate = timestamp.toLocaleDateString('en-US', {
        weekday: 'long',
        day: '2-digit',
      });

    const formattedTime = timestamp.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

    return(
        <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', paddingHorizontal: 12, paddingVertical: 18,gap: 12}}>
            <Box style={{borderRadius: 20, paddingVertical: 8, paddingLeft:20}}>
            <Text style={[styles.title, { color: textColor, fontSize: 32, fontWeight: 'bold', width: 50}]}>
                {formattedDate}
            </Text>          
            </Box>
            <Box style={{paddingVertical: 8}}>
            <Text style={[styles.title, {color:textColor}]}>{formattedTime}</Text>
            <Text style={[styles.title, {color:textColor, fontWeight: 'bold'}]}>Dr. {item.doctorName}</Text>
            <Text style={[styles.title, {color: textColor}]}>{item.name}</Text>
            </Box>
        </View>
        </TouchableOpacity>
        )
    };

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#1C6BA4' : '#257cba';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  const onPressFunction = () => {
    console.log(userData);
  }

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('Logout successful!');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };


  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>👋 Hello!</Text>
            <Text style={{
              fontFamily: 'Nunito Sans', 
              fontSize: 28, 
              color: 'black', 
              fontWeight: 'bold'}}>{userData?.firstName || '---'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar label={userData?.firstName} />
          </TouchableOpacity>
        </View>

        <View style={styles.services}>
          <Text style={styles.servicesText}>Services</Text>
              <View style={{marginTop: 12, display: 'flex', flexDirection: 'row', gap: 12, justifyContent: 'center'}}>
              {/* 1st button */}
              <IconButton
                onPress={() => navigation.navigate('Profile')}
                style={{
                  backgroundColor: '#DCEDF9',
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                }}
                icon={props => <Icon name="clipboard-outline" color={'#1C6BA4'} size={36} />}
              />
              {/* 2nd button */}
              <IconButton
                onPress={() => navigation.navigate('Assessment')}
                style={{
                  backgroundColor: '#F2E3E9',
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                }}
                icon={props => <Icon name="accessibility-outline" color={'#9D4C6C'} size={36} />}
              />
              {/* 3rd button */}
              <IconButton
                onPress={() => navigation.navigate('Profile')}
                style={{
                  backgroundColor: '#DCEDF9',
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                }}
                icon={props => <Icon name="clipboard-outline" color={'#1C6BA4'} size={36} />}
              />
              {/* 4th button */}
              <IconButton
                onPress={() => navigation.navigate('Profile')}
                style={{
                  backgroundColor: '#DCEDF9',
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                }}
                icon={props => <Icon name="clipboard-outline" color={'#1C6BA4'} size={36} />}
              />
              </View>
        </View>
        
        <LatestResults/>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Upcoming Appointments</Text>
          {isLoading ? (
            <ActivityIndicator size="large"/>
          ) : (
            <FlatList
            horizontal={true}
            data={appointmentList}
            renderItem={renderItem}
            keyExtractor={item => item.uid}
            extraData={selectedId}
            showsHorizontalScrollIndicator={false}
            />
          )}
            
        </View>
      </View>
  );
};

const LatestResults = () =>{
  const { userData, updateUser } = useUserContext();
  const [dataList, setDataList] = React.useState({});
  const [isLoading, setLoading] = React.useState(false);
  const trimmedUid = userData.uid.trim();

  const resultsMap = [
    'YES'
  ];

  React.useEffect(() => {
    setLoading(true);
    fetchResults();
  }, [])

  const fetchResults = async () => {
    try {
      const assessmentsSnapshot = await firestore()
        .collection('assessments')
        .orderBy('date', 'desc')
        .limit(1)
        .get();
  
      assessmentsSnapshot.forEach((doc) => {
        setDataList(doc.data());
      });

    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally{
      setLoading(false);
    }
  };

  const timestamp = new Date(
    dataList.date?.seconds * 1000 + dataList.date?.nanoseconds / 1000000
  );

  const formattedDate = timestamp.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  return(
    <View style={styles.stats}>
      <Box w={'100%'} h={'100%'} style={{ backgroundColor: "#FAF0DB", borderRadius: 32 }}>
          <Box style={{padding: 16, paddingHorizontal: 20, display: 'flex', flexDirection: 'row'}}>
            <Box style={{flex: 1}}>
              <Box style={{display:'flex', flexDirection:'row'}}>
                <Text style={{fontFamily: 'Nunito Sans', fontWeight:'bold', fontSize: 20, color: 'black', flex:1}}>Your Health</Text>
                {isLoading ? (
                  <Text>Getting date...</Text>
                ) : (
                  <Text>{formattedDate}</Text>
                )}
              </Box>
              {isLoading ? (
                <View style={{height:'100%', marginTop:60}}>
                  <ActivityIndicator size="large" color="blue" />
                  <Text style={{textAlign:'center'}}>Retrieving data...</Text>
                </View>
              ) : (
                <>
                  <Text style={{fontFamily: 'Nunito Sans', fontWeight:'normal', fontSize: 16, color: 'black', marginBottom: 12}}>These are your latest test results: </Text>
                  <Box style={{display:'flex', flexDirection:'row'}}>
                    <Box style={{flexDirection:'column', flex:1}}>
                      <Text>Physical Assessment</Text>
                      {dataList.phyiscalData?.map((item, index) => (
                        <Text key={index}>{item || ''}</Text>
                      ))}
                    </Box>
                    <Box style={{flexDirection:'column'}}>
                      <Text>Pain Assessment</Text>
                      {dataList.painData?.map((item, index) => (
                        <Text key={index}>{item || ''}</Text>
                      ))}
                    </Box>
                  </Box>
                  <Text>Range of Motion</Text>
                  <Text style={{fontFamily: 'Nunito Sans', fontWeight:'normal', fontSize: 16, color: 'black'}}>Max wrist flexion: {dataList.maxAngle}°</Text>
                </>
              )}
            </Box>
          </Box>
      </Box>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height:'100%',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 32
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32
  },
  headerText: {
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    color: 'black',
    fontStyle: 'normal',
    fontWeight: 'bold'
  },
  services: {
    marginBottom: 16
  },
  servicesText: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    color: 'black',
    fontStyle: 'normal',
    fontWeight: 'bold'
  },
  stats: {
    height: '35%',
    marginBottom: 16
  },
  footerText: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    color: 'black',
    fontStyle: 'normal',
    fontWeight: 'bold'
  },
  item: {
    height: 132,
    width: 260,
    borderRadius: 28,
    marginVertical: 8,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 18
  }
});

export default PatientScreen;
