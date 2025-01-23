import React from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
const AlerdyLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return <Navigate to="/home" replace />;
    }
  return (
      <Outlet />
  )
}

export default AlerdyLogin
