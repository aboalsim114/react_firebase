import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const Protected = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");

    setAuth(!!user);
  }, []);

  if (auth === null) {
    return null;
  }

  return auth ? <Outlet /> : <Navigate to="/connexion" />;

};

export default Protected;
