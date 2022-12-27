import React from 'react';
import './App.scss';
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import {Login} from "../../features/auth/component";
import {Home} from "../home/home";
import Header from "../navbar/header";
import {Account} from "../account/account";
import {Grid} from "@mui/material";
import {Footer} from "../navbar/footer";

export const App = () => {
    return <BrowserRouter>
        <Grid
            container
            spacing={0}
            direction="row"
            justifyContent="center"
            alignItems="center"
            style={{
                overflow: "auto",
                width: "100%",
                // TODO added 100% to take the whole webpage
                // height: window.innerHeight - 150,
                height: "100%",
                // backgroundColor: 'teal'
            }}
        >
            <Header/>
            <br/>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/home" element={<Home/>}/>
                <Route path="/account" element={<Account/>}/>
                <Route path="/" element={<Home/>}/>
                <Route path="*" element={<p>Path not resolved <Link to={"/home"}> go to home</Link></p>}/>
            </Routes>
            <Footer/>
        </Grid>
    </BrowserRouter>
}