import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { username: usernameFromUrl } = useParams();
  const token = localStorage.getItem('token');
  const usernameFromStorage = localStorage.getItem('tokenUser');

  if (!token || usernameFromUrl !== usernameFromStorage) {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenUser');
    return <Navigate to="/unauthorizedAccess" />;
  }

  return children;
};

export default PrivateRoute;
