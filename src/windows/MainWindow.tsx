import { useEffect, useState } from "react";
import { Add, Settings } from "@mui/icons-material";
import { Fab } from "@mui/material";

import "../app.global.css";
import Instance from "../components/Instance";
import { render } from "../lib/render";
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
        <div className="p-8">
            <h1 className="text-3xl font-bold font-sans mb-4">
                Welcome to MultiServer
            </h1>

            <div className="grid grid-cols-3 gap-2">
                {instances.map((instance) => (
                    <Instance key={instance.info.name} info={instance.info} />
                ))}
            </div>

            <div className="fixed bottom-4 left-4">
                <Fab
                    color="primary"
                    aria-label="New instance"
                    onClick={ipc.settingsWindow}
                >
                    <Settings />
                </Fab>
            </div>

            <div className="fixed bottom-4 right-4">
                <Fab
                    color="primary"
                    aria-label="New instance"
                    onClick={ipc.newInstanceWindow}
                >
                    <Add />
                </Fab>
            </div>
        </div>
    );
};

render(MainWindow);
