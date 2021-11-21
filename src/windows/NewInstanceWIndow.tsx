import React from "react";
import ReactDOM from "react-dom";

declare const instances: {
    newInstanceWindow: () => void;
};

const NewInstanceWindow = () => {
    return <div>New Instance</div>;
};

ReactDOM.render(
    <React.StrictMode>
        <NewInstanceWindow />
    </React.StrictMode>,
    document.getElementById("root")
);
