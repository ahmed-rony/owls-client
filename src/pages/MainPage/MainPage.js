import React, { useContext } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { DarkModeContext } from '../../context/darkModeContext';
import Home from '../home/Home';
import Login from '../login/Login';
import Profile from '../profile/Profile';
import Register from '../register/Register';
import Layout from '../../components/Layout/Layout';
import PrivateRoute from '../../components/PrivateRoute/PrivateRoute';
import Page404 from '../Page404/Page404';

const MainPage = () => {

    return (
        <div>

            <Router>
                <Routes>
                    <Route element={<PrivateRoute />}>
                        <Route path='/' element={<Layout />}>
                            <Route path='/' element={<Home />}></Route>
                            <Route path="/profile/:id" element={<Profile />}></Route>
                        </Route>
                    </Route>
                    <Route path='/login' element={<Login />}></Route>
                    <Route path='/register' element={<Register />}></Route>
                    <Route path='*' element={<Page404 />}></Route>
                </Routes>
            </Router>

        </div>
    );
}

export default MainPage;