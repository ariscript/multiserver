import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import "../app.global.css";
import Instance from "../components/Instance";
import type { InstanceInfo } from "../types";

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

            <div className="grid grid-cols-3 gap-2">
                {instances.map((instance) => (
                    <Instance key={instance.info.name} info={instance.info} />
                ))}
            </div>

            <div className="fixed bottom-4 right-4">
                <Fab
                    color="primary"
                    aria-label="New instance"
                    onClick={ipc.newInstanceWindow}
                >
                    <AddIcon />
                </Fab>
            </div>
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <MainWindow />
    </React.StrictMode>,
    document.getElementById("root")
);
