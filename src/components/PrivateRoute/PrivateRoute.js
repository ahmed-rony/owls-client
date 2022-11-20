import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

const PrivateRoute = ({children, ...rest}) => {
    const {currentUser} = useContext(AuthContext);
    const location = useLocation();

    return (
        (currentUser && currentUser.email)
        ? <Outlet />
        : <Navigate to='/login' state={{ from : location }} replace />
    );
};

export default PrivateRoute;