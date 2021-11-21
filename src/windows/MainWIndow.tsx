import React from "react";
import ReactDOM from "react-dom";

declare const instances: {
    newInstanceWindow: () => void;
};

const MainWindow = () => {
    return (
        <div>
            <h1>Welcome to MultiServer</h1>
            {/* TODO: add instances view */}
            <button onClick={instances.newInstanceWindow}>New Instance</button>
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <MainWindow />
    </React.StrictMode>,
    document.getElementById("root")
);
