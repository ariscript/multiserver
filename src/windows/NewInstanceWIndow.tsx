import React from "react";
import ReactDOM from "react-dom";

const NewInstanceWindow = () => {
    return <div>New Instance</div>;
};

ReactDOM.render(
    <React.StrictMode>
        <NewInstanceWindow />
    </React.StrictMode>,
    document.getElementById("root")
);
