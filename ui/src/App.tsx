import React from 'react';
import './App.css';
import {DiagramMakerContainer} from "./components/diagram-maker-container";
import {getData} from "./components/BoundaryCircular/data";

export const App = () => {
    let diagramMakerData = getData(500, 400);
    return <div className="row">
        <div className="column">
            <DiagramMakerContainer initialData={diagramMakerData}/>
        </div>
        <div className="column">
            <h2>Width:</h2>
            <h2>Height:</h2>
        </div>
    </div>
}