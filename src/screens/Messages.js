import React from 'react';
import { useUserContext } from '../../contexts/UserContext';
import PatientMessages from './ChatFunction/PatientMessages';
import DoctorMessages from './ChatFunction/DoctorMessages';

const Messages = ({navigation}) => {
    const { userData } = useUserContext();

    return (
        <>
          {userData?.role === 0 ? <PatientMessages navigation={navigation} /> : <DoctorMessages navigation={navigation} />}
        </>
      );
};

export default Messages;