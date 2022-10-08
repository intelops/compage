import React, {createContext, useReducer} from 'react';
import './App.css';
import {initialState, reducer} from "./store/auth_reducer";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {Login} from "./components/auth/login";
import {Home} from "./components/home";
import Navbar from "./components/navbar/navbar";
import {Repo} from "./components/repo/repo";

export const AuthContext = createContext(null);

export const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <AuthContext.Provider
        value={{
            state,
            dispatch
        }}>
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/repo" element={<Repo/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path="*" element={<p>Path not resolved <Link to={"/home"}> go to home</Link></p>}/>
            </Routes>
        </BrowserRouter>
    </AuthContext.Provider>
}