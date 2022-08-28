import React, {useState} from 'react';
import './App.css';
import {DiagramMakerContainer} from "./components/diagram-maker-container";
import {getData} from "./components/BoundaryCircular/data";

export const App = () => {
    // const ref = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    // useEffect(() => {
    //     if (ref.current.offsetHeight !== 0) {
    //         setHeight(ref.current.offsetHeight);
    //     } else {
    //         setHeight(400)
    //     }
    //     setWidth(ref.current.offsetWidth);
    //     // console.log("ref.current.parentElement : ", ref.current);
    //     // console.log("ref.current.parentElement.offsetHeight : " + ref.current.parentElement.offsetHeight);
    //     // console.log("ref.current.parentElement.offsetWidth : " + ref.current.parentElement.offsetWidth);
    //     // console.log("ref.current.offsetHeight : " + ref.current.offsetHeight);
    //     // console.log("ref.current.offsetWidth : " + ref.current.offsetWidth);
    // }, []);
    let diagramMakerData = getData(width+500, height + 400);
    return <div className="row">
        {/*<div className="column" ref={ref}>*/}
        <div className="column">
            <DiagramMakerContainer initialData={diagramMakerData}/>
        </div>
        <div className="column">
            <h2>Width: {width}</h2>
            <h2>Height: {height}</h2>
        </div>
        <div className="column">
            <h2>Width: {width}</h2>
            <h2>Height: {height}</h2>
        </div>
    </div>
}