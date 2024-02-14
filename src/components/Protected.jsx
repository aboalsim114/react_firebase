import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
// import { auth } from '../config/firebase';

const Protected = () => {
    const user = localStorage.getItem("user");
    // const user = auth.currentUser
  return (
    user ? <Outlet/> : <Navigate to="/connexion" />
  )
}

export default Protected
