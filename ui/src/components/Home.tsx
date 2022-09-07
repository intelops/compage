import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../App";
import {getData} from "../data/BoundaryCircular/data";
import {DiagramMakerContainer} from "./diagram-maker/diagram-maker-container";

export const Home = () => {
    const {state, dispatch} = useContext(AuthContext);

    if (!state.isLoggedIn) {
        return <Navigate to="/login"/>;
    }

    const {avatar_url, name, public_repos, followers, following} = state.user

    const handleLogout = () => {
        dispatch({
            type: "LOGOUT"
        });
    }
    let diagramMakerData = getData(500, 400);
    return (
        <div className="container">
            <button onClick={() => handleLogout()}>Logout</button>
            <div className="row">
                <div className="column">
                    <DiagramMakerContainer initialData={diagramMakerData}/>
                </div>
                <div className="column">
                    <div id="diagramMakerLogger"></div>
                </div>
                <div className="column">
                    <div className="content">
                        <img src={avatar_url} alt="Avatar"/>
                        <span>{name}</span>
                        <span>{public_repos} Repos</span>
                        <span>{followers} Followers</span>
                        <span>{following} Following</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
