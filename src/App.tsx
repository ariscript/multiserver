import React from "react";
import ReactDOM from "react-dom";

const App = () => {
    return (
        <div>
            <h1>Hello World</h1>
            React doing react things pog
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
