// PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
    children: React.ReactElement;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const token = sessionStorage.getItem("authToken");

    return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
