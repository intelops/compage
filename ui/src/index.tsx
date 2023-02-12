import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import {App} from './components/app/App';
import reportWebVitals from './reportWebVitals';
import 'diagram-maker/dist/diagramMaker.css';
import 'react-json-pretty/themes/monikai.css';
import {Provider} from "react-redux";
import {persistor, store} from './redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import ReduxToastr from 'react-redux-toastr'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App/>
            </PersistGate>
            <ReduxToastr
                timeOut={3000}
                newestOnTop={false}
                preventDuplicates
                position="bottom-left"
                getState={(state) => state.toastr} // This is the default
                transitionIn="fadeIn"
                transitionOut="fadeOut"
                progressBar
                closeOnToastrClick/>
        </Provider>
    </React.StrictMode>
);

const backup = console.error;
console.error = function filterWarnings(msg) {
    const suppressedWarnings = ['Use createRoot instead', "Legacy context API has been detected within a strict-mode tree"];

    if (!suppressedWarnings.some(entry => msg.includes(entry))) {
        backup.apply(console, arguments);
    }
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
