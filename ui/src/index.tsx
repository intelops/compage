import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import reportWebVitals from './reportWebVitals';
import 'diagram-maker/dist/diagramMaker.css';
import 'react-json-pretty/themes/monikai.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

const backup = console.error;
console.error = function filterWarnings(msg) {
    const suppressedWarnings = ['Use createRoot instead'];

    if (!suppressedWarnings.some(entry => msg.includes(entry))) {
        backup.apply(console, arguments);
    }
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
