import React from "react";
import ReactDOM from "react-dom";

import "../app.global.css";

const MainWindow = () => {
    return (
        <div>
            <h1>Welcome to MultiServer</h1>
            {/* TODO: add instances view */}
            <button onClick={window.ipc.newInstanceWindow}>New Instance</button>
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <MainWindow />
    </React.StrictMode>,
    document.getElementById("root")
);
