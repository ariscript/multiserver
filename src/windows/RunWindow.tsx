import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import { InstanceInfo } from "../types";

const RunWindow = (): JSX.Element => {
    const [info, setInfo] = useState<InstanceInfo | null>(null);
    const [players, setPlayers] = useState<string[]>([]);

    useEffect(() => {
        server.onInfo(setInfo);
        server.onPlayers(setPlayers);
    }, []);

    return (
        <div>
            <h2>Running server {info?.info.name}</h2>
            <div>
                <h3>Players</h3>
                <ul>
                    {players.map((p) => (
                        <li key={p}>{p}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <RunWindow />
    </React.StrictMode>,
    document.getElementById("root")
);
