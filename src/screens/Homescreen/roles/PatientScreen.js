import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Avatar, IconButton, Box, Divider } from "@react-native-material/core";
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

  const trimmedUid = userData?.uid.trim();

  React.useEffect(() => {
    setLoading(true);
    const fetchAppointments = async () => {
      try {
        const appointmentsSnapshot = await firestore()
          .collection('appointments')
          .where('patient_assigned', '==', trimmedUid)
          .limit(1)
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
              doctorName: doctorData?.lastName,
              doctorPhoto: doctorData?.profilePictureURL,
              patientName: patientData?.firstName,
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

const Item = ({ item, onPress, backgroundColor, textColor }) => {
  
  const timestamp = new Date(
      item.date.seconds * 1000 + item.date.nanoseconds / 1000000
    );
  
  const formattedDate = timestamp.toLocaleDateString('en-US', {
      month: 'long',
      weekday: 'long',
      day: '2-digit',
    });

  const formattedTime = timestamp.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

  return(
      <View style={[styles.item, {backgroundColor}]}>
        <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', paddingHorizontal: 12, paddingVertical: 18,gap: 12}}>
            <Box style={{borderRadius: 20, paddingVertical: 8, paddingLeft:6}}>
              <Avatar label={item.firstName} size={55} 
                image={
                  <Image
                  source={{ uri: item?.doctorPhoto || 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png'}}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 28,
                  }}
                  />
                  }
                />
            </Box>
            <Box style={{paddingVertical: 8}}>
              <Text style={[styles.title, {color:textColor, fontWeight: 'bold'}]}>Dr. {item.doctorName}</Text>
              <Text style={[styles.title, {color: textColor}]}>{item.name}</Text>
            </Box>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', marginHorizontal: 16, marginBottom: 20, backgroundColor:'#A8D5BA', borderRadius:4, paddingVertical: 4,paddingHorizontal: 12, gap: 32}}>
          <View style={{display: 'flex', flexDirection: 'row', alignItems:'center', gap: 6,flex: 1}}>
            <Icon name="calendar-outline" size={20}/>
            <Text>{formattedDate}</Text>
          </View>
          <View style={{display: 'flex', flexDirection: 'row', alignItems:'center', gap: 6}}>
            <Icon name="time-outline" size={20}/>
            <Text>{formattedTime}</Text>
          </View>
        </View>
      </View>
      )
  };

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#65A89F' : '#257cba';
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
          <Image
              source={{ uri: userData?.profilePictureURL || 'https://cdn.vox-cdn.com/thumbor/yIoKynT0Jl-zE7yWwzmW2fy04xc=/0x0:706x644/1400x1400/filters:focal(353x322:354x323)/cdn.vox-cdn.com/uploads/chorus_asset/file/13874040/stevejobs.1419962539.png'}}
              color='#CEDDF7'
              style={{
              width: 80,
              height: 80,
              borderRadius: 75,
              borderWidth: 5,
              borderColor: 'white',
              }}
          />
          </TouchableOpacity>
        </View>

        <LatestResults/>

        <View style={styles.services}>
          <Text style={styles.servicesText}>Services</Text>
              <View style={{marginTop: 12, display: 'flex', flexDirection: 'row', gap: 12, justifyContent: 'center', paddingHorizontal: 16}}>
              {/* 1st button */}
              <IconButton
                onPress={() => navigation.navigate('Profile')}
                style={{
                  backgroundColor: '#D1B655',
                  width: '50%',
                  height: 80,
                  borderRadius: 8,
                }}
                icon={props => <Icon name="clipboard-outline" color={'#F2F2F2'} size={36} />}
              />
              {/* 2nd button */}
              <IconButton
                onPress={() => navigation.navigate('Assessment')}
                style={{
                  backgroundColor: '#D1B655',
                  width: '50%',
                  height: 80,
                  borderRadius: 8,
                }}
                icon={props => <Icon name="accessibility-outline" color={'#F2F2F2'} size={36} />}
              />
              </View>
        </View>
      
        <View style={styles.footer}>
          <Text style={styles.footerText}>Upcoming Appointment</Text>
          {isLoading ? (
            <ActivityIndicator size="large"/>
          ) : (
            <View style={{justifyContent:'center', alignContent:'center', alignItems:'center'}}>
              <FlatList
                horizontal={true}
                data={appointmentList}
                renderItem={renderItem}
                keyExtractor={item => item.uid}
                extraData={selectedId}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
            
        </View>
      </View>
  );
};

const LatestResults = () =>{
  const { userData, updateUser } = useUserContext();
  const [dataList, setDataList] = React.useState({});
  const [isLoading, setLoading] = React.useState(false);
  const trimmedUid = userData?.uid.trim();


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
        .where('patient', '==', trimmedUid)
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
    dataList?.date?.seconds * 1000 + dataList?.date?.nanoseconds / 1000000
  );

  const formattedDate = timestamp.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  const outputDate = formattedDate !== 'Invalid Date' ? formattedDate : '';

  return(
    <View style={styles.stats}>
      <Box w={'100%'} h={'100%'} style={{ backgroundColor: "rgba(174, 223, 247, 0.7)", borderRadius: 20 }}>
          <Box style={{padding: 16, paddingHorizontal: 20, display: 'flex', flexDirection: 'row'}}>
            <Box style={{flex: 1}}>
              <Box style={{display:'flex', flexDirection:'row', marginBottom: 20}}>
                <Text style={{fontFamily: 'Nunito Sans', fontWeight:'bold', fontSize: 20, color: 'black', flex:1}}>Last Assessment</Text>
                {isLoading ? (
                  <Text>Getting date...</Text>
                ) : (
                  <Text>{outputDate}</Text>
                )}
              </Box>
              {isLoading ? (
                <View style={{height:'100%', marginTop:60}}>
                  <ActivityIndicator size="large" color="blue" />
                  <Text style={{textAlign:'center'}}>Retrieving data...</Text>
                </View>
              ) : (
                <>
                  <View style={{marginBottom: 60}}>
                    <Text style={{fontFamily: 'Nunito Sans', fontWeight:'normal', fontSize: 16, color: 'black', marginBottom: 12}}>Maximum wrist range of motion:</Text>
                    <Text style={{fontSize: 32, fontWeight:'bold', color:'#696969'}}>{dataList.maxAngle}°</Text>
                  </View>
                  {dataList && dataList.painData ? (
                  <View style={{display:'flex', flexDirection:'row', borderTopWidth: 1, justifyContent:'space-around'}}>
                    <View style={{borderRightWidth: 1, paddingHorizontal: 4,minWidth: 60}}>
                      <Text style={{fontWeight:'bold', color:'black' }}>VAS Score</Text>
                      <Text style={{color:'#696969' }}>{dataList?.painData[0]}</Text>
                    </View>
                    <View style={{borderRightWidth: 1, paddingHorizontal: 4, minWidth: 60}}>
                      <Text style={{fontWeight:'bold',color:'black'}}>Pain</Text>
                      <Text style={{color:'#696969' }}>{dataList?.painData[1]}</Text>
                    </View>
                    <View style={{borderRightWidth: 1, paddingHorizontal: 4, minWidth: 60}}>
                      <Text style={{fontWeight:'bold', color:'black'}}>Warm?</Text>
                      <Text style={{color:'#696969' }}>{dataList?.phyiscalData[3]}</Text>
                    </View>
                    <View style={{paddingHorizontal: 4, minWidth: 60}}>
                      <Text style={{fontWeight:'bold', color:'black'}}>VAS Score</Text>
                      <Text style={{color:'#696969' }}>6</Text>
                    </View>
                  </View>
                  ) : (
                    null
                  )}
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
    color: '#343434',
    fontStyle: 'normal',
    fontWeight: 'bold'
  },

  services: {
    marginBottom: 16,
  },

  servicesText: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    color: '#343434',
    fontStyle: 'normal',
    fontWeight: 'bold',
    
  },

  stats: {
    height: '35%',
    marginBottom: 16
  },

  footer: {
    width: '100%'
  },

  footerText: {
    fontFamily: 'Nunito Sans',
    fontSize: 20,
    color: '#343434',
    fontStyle: 'normal',
    fontWeight: 'bold'
  },

  item: {
    paddingHorizontal: 12,
    height: 'auto',
    width: 'auto',
    borderRadius: 12,
    marginVertical: 8,
  },

  title: {
    fontSize: 18
  }
});

export default PatientScreen;
