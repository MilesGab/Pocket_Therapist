import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUserContext } from '../../contexts/UserContext';
import firestore from '@react-native-firebase/firestore';
import {
  Avatar,
  Divider,
  Provider,
  Stack,
  Button,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  TextInput,
  ActivityIndicator,
} from "@react-native-material/core";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { FlatList } from 'react-native-gesture-handler';


const AppointmentCard = ( props ) => {
  const { userData, updateUser } = useUserContext();
  const doctor_name = props.doctorName;
  const patient_name = props.patientName
  const date = props.date;

  const nameToDisplay = userData?.role === 1 ? patient_name : `Dr. ${doctor_name}`;
  const timestamp = new Date(
    date.seconds * 1000 + date.nanoseconds / 1000000
  );

  const formattedDate = timestamp.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  const formattedTime = timestamp.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return(
    <View style={{display:'flex',
      backgroundColor:'#65A89F', 
      width:'100%', 
      justifyContent:'center', 
      alignContent:'center',
      paddingHorizontal:10, 
      paddingVertical:6,
      borderRadius:12,
      marginBottom: 16
      }}
      >
      <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom:6}}>
        <View style={{flexDirection:'column', flex:1}}>  
          <Text style={{color:'white'}}>Appointment Date</Text>
          <Text style={{fontWeight:'bold', color:'white', fontSize:16}}>{formattedDate} {formattedTime}</Text>
        </View>
      </View>
      <Divider color='white'/>
      <View style={{marginTop: 6, paddingVertical:12, flexDirection:'row'}}>
        <Avatar
          image={{
            uri: userData?.role === 0 ? props?.docPic : props?.patientPic
          }}
        />
        <View style={{marginLeft: 10, flexDirection:'column'}}>
          <Text style={{fontWeight:'bold', color:'white', fontSize:16}}>{nameToDisplay}</Text>
          <Text style={{color:'white', fontSize:16}}>{props?.name}</Text>
        </View>
      </View>
    </View>
  )
}

const RequestDialog = (props) => {
  return(
    <Dialog visible={props.visible} onDismiss={() => props.setVisible(false)}>
    <DialogHeader title="Appointment Sent" />
    <DialogContent>
      <Text style={{fontSize:20}}>
        Request for appointment on {<Text style={{fontWeight:'bold'}}>{props.date}</Text>} at {<Text style={{fontWeight:'bold'}}>{props.time}</Text>} has been sent! A notification will be sent once confirmed.
      </Text>
    </DialogContent>
    <DialogActions>
      <Button
        title="Ok"
        compact
        variant="text"
        onPress={() => props.setVisible(false)}
      />
    </DialogActions>
  </Dialog>
  )
}

const AddAppointment = (props) => {
  const { userData, updateUser } = useUserContext();
  const [visible, setVisible] = React.useState(false);
  const [value, setValue] = React.useState('consultation');
  const [items, setItems] = React.useState([
    {label: 'Consultation', value: 'Consultation'},
    {label: 'Assessment', value: 'Assessment'}
  ]);
  const [open, setOpen] = React.useState(false);

  const [date, setDate] = React.useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: false,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    //POST REQUEST
    const createAppointmentRequest = async () => {
      const trimmedUid = userData.uid.trim();

      try {
        const appointmentRef = await firestore().collection('appointments').add({
          date,
          doctor_assigned: userData?.doctor,
          name: value,
          patient_assigned: trimmedUid,
          status: 0
        });

        const generatedUID = appointmentRef.id;
        await appointmentRef.update({ uid: generatedUID });

      } catch (error) {
        console.error('Failed to create appointment: ', error);
      }finally{
        props.fetchList();
      }
    };

    const onSetAppoint = () => {
      props.setVisible(false); 
      createAppointmentRequest(); 
      setVisible(true)
    }

  return (
    <>
      <Dialog visible={props.visible} onDismiss={() => props.setVisible(false)}>
        <DialogHeader title="Set Appointment" />
        <DialogContent>
          <Stack spacing={12}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            style={{width:150, backgroundColor:'white', borderWidth:0.5}}
            dropDownContainerStyle={{ width: 150, borderWidth:0.5, backgroundColor:'white'}}
            textStyle={{fontSize:16}}
          />
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <Text style={{color:'black', flex:1, fontSize:16}}>Select Date: {formattedDate} </Text>
              <TouchableOpacity onPress={showDatepicker}>
                <Icon name="calendar" style={{fontSize:18}}/>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row'}}>
              <Text style={{color:'black', flex:1, fontSize:16}}>Select Time: {formattedTime}</Text>
              <TouchableOpacity onPress={showTimepicker}>
                <Icon name="time" style={{fontSize:18}}/>
              </TouchableOpacity>
            </View>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            title="Cancel"
            compact
            variant="text"
            onPress={() => {props.setVisible(false)}}
          />
          <Button
            title="Confirm"
            compact
            variant="text"
            onPress={onSetAppoint}
          />
        </DialogActions>
      </Dialog>
      <RequestDialog visible={visible} setVisible={setVisible} time={formattedTime} date={formattedDate}/>
    </>
  );
}

const Schedule = () => {
  const { userData, updateUser } = useUserContext();
  const trimmedUid = userData?.uid.trim();
  const [isLoading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [value, setValue] = React.useState('upcoming');
  const [appointmentList, setAppointmentList] = React.useState([]);
  const dateToday = new Date();
  const [items, setItems] = React.useState([
    {label: 'Upcoming', value: 'upcoming'},
    {label: 'Past', value: 'past'}
  ]);

  const fetchAppointments = async () => {

    const role = userData?.role;
    let whereField, whereValue;

    if (role === 1) {
      whereField = 'doctor_assigned';
      whereValue = trimmedUid;
    } else {
      whereField = 'patient_assigned';
      whereValue = trimmedUid;
    }

    try {
      const appointmentsSnapshot = await firestore()
        .collection('appointments')
        .where('status', '==', 1)
        .where(whereField, '==', whereValue)
        .get();

      const appointmentsData = await Promise.all(
        appointmentsSnapshot.docs.map(async doc => {
          const appointmentData = doc.data();
          const doctorId = appointmentData.doctor_assigned; // Get the doctor ID from appointment data
          const patientId = appointmentData.patient_assigned; // Get the patient ID from appointment data

          // Fetch doctor and patient data separately
          const [doctorSnapshot, patientSnapshot] = await Promise.all([
            firestore().collection('users').doc(doctorId).get(),
            firestore().collection('users').doc(patientId).get(),
          ]);

          const doctorData = doctorSnapshot.data();
          const patientData = patientSnapshot.data();

          return {
            ...appointmentData,
            doctorName: doctorData.firstName,
            patientName: patientData.firstName + ' ' + patientData.lastName,
            patientPic: patientData.profilePictureURL,
            docPic: doctorData.profilePictureURL
          };
        })
      );

      setAppointmentList(appointmentsData);
    } catch (error) {
      // console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointmentList.filter(appointment => {
    const appointmentDate = appointment.date.toDate();

    if (value === 'upcoming'){
    return appointmentDate > dateToday;
    } else {
      return appointmentDate < dateToday;
    }
  });

  return (
    <Provider>
    <View style={styles.container}>
      <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginBottom: 48}}>
        <Text style={{fontSize: 32, color: 'black', fontWeight:'bold', flex: 1}}>Schedule</Text>
        <TouchableOpacity onPress={()=>{setDialogOpen(true)}}>
          <Icon name="add-circle-outline" style={{fontSize:38, color:'black', marginRight: 12}}/>
        </TouchableOpacity>
        <AddAppointment visible={dialogOpen} setVisible={setDialogOpen} fetchList={fetchAppointments}/>
      </View>

      <View style={{}}>
        <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            style={{width:130, borderWidth:0, backgroundColor:'white'}}
            dropDownContainerStyle={{ width: 130, borderWidth:0 , backgroundColor:'white'}}
          />
        </View>
      </View>

      <View style={{
      flex: 1,
      borderRadius: 10,
      overflow: 'hidden',
      justifyContent: 'center',
      alignContent: 'center',
      marginTop: 16,
    }}>
      {isLoading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        filteredAppointments.length === 0 ? (
          value === 'upcoming' ? 
          <View style={{display:'flex', justifyContent:'center', alignContent:'center', alignItems:'center'}}>
            <Icon style={{fontSize:100, color:'#696969'}} name="calendar-clear-outline"/>
            <Text style={{fontSize:20, color:'#696969'}}>No upcoming appointments</Text> 
          </View>
          : 
          <View style={{display:'flex', justifyContent:'center', alignContent:'center', alignItems:'center'}}>
            <Icon style={{fontSize:100}} name="calendar-clear-outline"/>
            <Text style={{fontSize:20}}>No past appointments</Text> 
          </View>
      
        ) : (
          <FlatList
            horizontal={false}
            data={filteredAppointments}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => (
              // Render your AppointmentCard component here for each item
              <AppointmentCard {...item}/>
            )}
            showsVerticalScrollIndicator={false}
          />
        )
      )}
    </View>
    </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f1f1',
    height: '100%',
    padding: 20,
  },
});

export default Schedule;
