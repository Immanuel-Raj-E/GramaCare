import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { HeartPulse } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  // Demo Mode: Permissions and role restrictions removed for seamless demonstration
  return children;
};

export default ProtectedRoute;
