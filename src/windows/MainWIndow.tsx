import React from "react";
import ReactDOM from "react-dom";
import "tailwindcss/tailwind.css";

import "../app.global.css";

const MainWindow = () => {
    return (
        <div>
            <h1>Welcome to MultiServer</h1>
            {/* TODO: add instances view */}
            <button
                onClick={ipc.newInstanceWindow}
                className="rounded-md text-black bg-green-500 hover:bg-green-600 focus:bg-green-700 p-1 focus:text-white border-2 border-black transition-colors"
            >
                New Instance
            </button>
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <MainWindow />
    </React.StrictMode>,
    document.getElementById("root")
);
