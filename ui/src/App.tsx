import React from 'react';
import './App.scss';
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {Login} from "./components/authentication/login";
import {Home} from "./components/home";
import Navbar from "./components/navbar/navbar";
import {Repo} from "./components/repo/repo";

export const App = () => {
    return <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/repo" element={<Repo/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="*" element={<p>Path not resolved <Link to={"/home"}> go to home</Link></p>}/>
        </Routes>
    </BrowserRouter>
}