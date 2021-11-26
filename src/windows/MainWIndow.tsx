import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import type { InstanceInfo } from "../types";

import "../app.global.css";
import Instance from "../components/Instance";

const MainWindow = () => {
    const [instances, setInstances] = useState<InstanceInfo[]>([]);

    useEffect(() => {
        const fetchInstances = () =>
            void ipc
                .getInstances()
                .then(setInstances)
                .catch((err) => log.error(err));

        fetchInstances();
    }, []);

    return (
        <div>
            <h1>Welcome to MultiServer</h1>

            <div className="grid grid-cols-3">
                {instances.map((instance) => (
                    <Instance info={instance.info} />
                ))}
            </div>

            <button
                onClick={ipc.newInstanceWindow}
                className="rounded-md text-black bg-green-500 hover:bg-green-600 focus:bg-green-700 p-2 focus:text-white border-2 border-black transition-colors"
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
