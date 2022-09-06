import React, {createContext, useReducer} from 'react';
import './App.css';
import {initialState, reducer} from "./store/reducer";
import {HashRouter as Router, Link, Route, Routes} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";

export const AuthContext = createContext(null);

export const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <AuthContext.Provider
        value={{
            state,
            dispatch
        }}
    >
        <Router>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/about">About us</Link>
            </nav>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </Router>
    </AuthContext.Provider>
}