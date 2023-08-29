import React, { useState, useEffect } from 'react';
// import { useSnackbar } from 'notistack';
import auth from '@react-native-firebase/auth'; // Import Firebase Authentication module for React Native

const contextData = {
  user: null,
  updateUser: null,
  logout: null,
  isLoggedIn: () => {},
};

export const AppContext = React.createContext(contextData);

const _alertSx = {
  width: {
    sx: '100%',
    sm: 288,
  },
  boxShadow: `0px 3px 5px -1px rgb(0 0 0 / 20%),
    0px 6px 10px 0px rgb(0 0 0 / 14%),
    0px 1px 18px 0px rgb(0 0 0 / 12%)`,
};

function AppProvider(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { children } = props;

  const isLoggedIn = () => {
    return !!auth().currentUser;
  };

  const [context, setContext] = React.useState({ ...contextData, isLoggedIn });

  const updateContext = (contextUpdates = {}) =>
    setContext((currentContext) => ({ ...currentContext, ...contextUpdates }));

  React.useEffect(() => {
    if (context?.updateUser === null) {
      updateContext({
        updateUser: (value) => {
          if (typeof value === 'function') {
            setContext((currentContext) => ({
              ...currentContext,
              user: value(currentContext.user),
            }));
          } else if (typeof value === 'object') {
            updateContext({ user: value });
          } else {
            throw new Error('invalid `user` type!');
          }
        },
      });
    }
  }, [context?.updateUser]);

  React.useEffect(() => {
    if (context?.logout === null) {
      updateContext({
        logout: async () => {
          console.log('SIGN OUT!');
          try {
            await auth().signOut();
            updateContext({ user: null });
          } catch (error) {
            console.error('Error signing out:', error);
          }
        },
      });
    }
  }, [context?.logout]);

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}

export default AppProvider;
