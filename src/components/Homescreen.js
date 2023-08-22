import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Avatar, IconButton, Box } from "@react-native-material/core";
import Icon from 'react-native-vector-icons/Ionicons';
import { blue } from 'react-native-reanimated';
import { FlatList, ScrollView, TouchableOpacity} from 'react-native';


const HomeScreen = () => {

  const [selectedId, setSelectedId] = React.useState();

  const getRandomColor = () => {
    const colors = ['#fc9079', '#3498DB', '#5bba83', '#ebc68d', '#b681cc'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'Consultation',
      date: '25',
      day: 'Fri',
      doctor: 'Dr. Mim Akhter',
      time: '03:00 PM'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'Catch up',
      date: '28',
      day: 'Mon',
      doctor: 'Dr. Mim Akhter',
      time: '03:00 PM'
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      title: 'Consultation',
      date: '31',
      day: 'Thu',
      doctor: 'Dr. Mim Akhter',
      time: '03:00 PM'
    },
  ];

  const Item = ({item, onPress, backgroundColor, textColor}) => (
    
    <TouchableOpacity onPress={onPress} style={[styles.item, {backgroundColor}]}>
      <View style={{display: 'flex', flexDirection: 'row', justifyContent:'flex-start', paddingHorizontal: 12, paddingVertical: 18,gap: 12}}>
        <Box style={{borderRadius: 20, paddingVertical: 12, paddingHorizontal: 16}}>
          <Text style={[styles.title,{color:textColor, fontSize: 32, fontWeight: 'bold'}]}>{item.date}</Text>
          <Text style={[styles.title,{color:textColor, fontSize: 20, textAlign: 'center'}]}>{item.day}</Text>
        </Box>
        <Box style={{paddingVertical: 8}}>
          <Text style={[styles.title, {color:textColor}]}>{item.time}</Text>
          <Text style={[styles.title, {color:textColor, fontWeight: 'bold'}]}>{item.doctor}</Text>
          <Text style={[styles.title, {color: textColor}]}>{item.title}</Text>
        </Box>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#1C6BA4' : getRandomColor();
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
    console.log('Hello!');
  }

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>👋 Hello!</Text>
            <Text style={{
              fontFamily: 'Nunito Sans', 
              fontSize: 28, 
              color: 'black', 
              fontWeight: 'bold'}}>Mico Ruiz D. Linco</Text>
          </View>
          <TouchableOpacity onPress={() => {}}>
            <Avatar label="Mico Linco" />
          </TouchableOpacity>
        </View>

        <View style={styles.services}>
          <Text style={styles.servicesText}>Services</Text>
              <View style={{marginTop: 12, display: 'flex', flexDirection: 'row', gap: 12, justifyContent: 'center'}}>
              <IconButton
                style={{
                  backgroundColor: '#DCEDF9',
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                }}
                icon={props => <Icon name="clipboard-outline" color={'#1C6BA4'} size={36} />}
              />
              <IconButton
                style={{
                  backgroundColor: '#F2E3E9',
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                }}
                icon={props => <Icon name="accessibility-outline" color={'#9D4C6C'} size={36} />}
              />
              <IconButton
                style={{
                  backgroundColor: '#DCEDF9',
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                }}
                icon={props => <Icon name="clipboard-outline" color={'#1C6BA4'} size={36} />}
              />
              <IconButton
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
        
        <View style={styles.stats}>
          <Box w={'100%'} h={'100%'} style={{ backgroundColor: "#FAF0DB", borderRadius: 32 }}>
              <Box style={{padding: 16, paddingHorizontal: 20, display: 'flex', flexDirection: 'row'}}>
                <Box style={{flex: 1}}>
                  <Text style={{fontFamily: 'Nunito Sans', fontWeight:'bold', fontSize: 20, color: 'black'}}>Your Health</Text>
                  <Text style={{fontFamily: 'Nunito Sans', fontWeight:'normal', fontSize: 16, color: 'black', marginBottom: 12}}>These are your latest test results: </Text>
                  <Text style={{fontFamily: 'Nunito Sans', fontWeight:'normal', fontSize: 16, color: 'black'}}>Range of Motion: </Text>
                </Box>
                  <Text>Your Health</Text>
              </Box>
          </Box>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Upcoming Appointments</Text>
            <FlatList
              horizontal={true}
              data={DATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              extraData={selectedId}
              showsHorizontalScrollIndicator={false}
            />
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
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

export default HomeScreen;
