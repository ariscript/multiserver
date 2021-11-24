import React, { useState } from "react";
import ReactDOM from "react-dom";
import TypeSelect from "../components/TypeSelect";
import VersionSelect from "../components/VersionSelect";

import "../app.global.css";

const NewInstanceWindow = () => {
    const [selectedServerType, setSelectedServerType] = useState("vanilla");
    const [selectedVersion, setSelectedVersion] = useState<string>("");

    const handleFormSubmit = () => {
        ipc.createInstance();
    };

    return (
        <div>
            <h2>New Instance</h2>
            <form onSubmit={handleFormSubmit}>
                <TypeSelect
                    value={selectedServerType}
                    onChange={setSelectedServerType}
                />
                <VersionSelect
                    type={selectedServerType}
                    value={selectedVersion}
                    onChange={setSelectedVersion}
                />

                <label htmlFor="java-path" className="pr-2">
                    Java Path
                </label>
                <input
                    name="java-path"
                    type="text"
                    placeholder="Java Path"
                    className="border-2 p-1"
                />

                <button role="button">Create</button>
            </form>
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <NewInstanceWindow />
    </React.StrictMode>,
    document.getElementById("root")
);
