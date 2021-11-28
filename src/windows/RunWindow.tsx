import { Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Helmet from "react-helmet";

import "../app.global.css";
import { InstanceInfo } from "../types";

const RunWindow = (): JSX.Element => {
    const [info, setInfo] = useState<InstanceInfo | null>(null);
    const [players, setPlayers] = useState<string[]>([]);
    const [stdout, setStdout] = useState<string[]>([]);
    const [stderr, setStderr] = useState<string[]>([]);

    const [command, setCommand] = useState<string>("");

    useEffect(() => {
        server.onInfo(setInfo);
        server.onPlayers(setPlayers);

        server.onStdout((out) => setStdout([...stdout, out]));
        server.onStderr((err) => setStderr([...stderr, err]));
    }, []);

    return (
        <div>
            <Helmet>
                <title>{`Running server ${info?.info.name ?? ""}`}</title>
            </Helmet>

            <div className="grid grid-cols-2">
                <div>
                    <h3>Players</h3>
                    <ul>
                        {players.map((p) => (
                            <li key={p}>{p}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Log</h3>
                    <div>
                        <pre>{stdout.join("\n")}</pre>
                        <pre className="text-red-600">{stderr.join("\n")}</pre>
                    </div>
                </div>
                <TextField
                    label="Command"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                />
                <Button onClick={() => server.rcon(command)}>Send</Button>
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
