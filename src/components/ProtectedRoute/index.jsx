import React, { useState, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from '../../axios-controller';
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [isValidModerator, setIsValidModerator] = useState(true);
  const adminUsername = localStorage.getItem('adminUsername');
  
  useEffect(() => {
    const verifyModerator = async () => {
      if (adminUsername) {
        try {
          const response = await axios.post('/moderators/verify', {
            username: adminUsername
          });
          setIsValidModerator(response.data.valid);
          if (!response.data.valid) {
            localStorage.removeItem('adminAuthenticated');
            localStorage.removeItem('adminUsername');
          }
        } catch (error) {
          console.error('Error verifying moderator:', error);
          setIsValidModerator(false);
          localStorage.removeItem('adminAuthenticated');
          localStorage.removeItem('adminUsername');
        }
      }
    };
    verifyModerator();
  }, [adminUsername]);
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true' && isValidModerator;
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/admin" />
        )
      }
    />
  );
};
export default ProtectedRoute;