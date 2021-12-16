import { Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Helmet from "react-helmet";
import Repl from "../components/Repl";

import "../app.global.css";
import { InstanceInfo } from "../types";

interface ServerOutput {
    type: "stdout" | "stderr";
    content: string;
}

const RunWindow = (): JSX.Element => {
    const [info, setInfo] = useState<InstanceInfo | null>(null);
    const [players, setPlayers] = useState<string[]>([]);
    const [output, setOutput] = useState<ServerOutput[]>([]);

    const [command, setCommand] = useState<string>("");

    useEffect(() => {
        server.onInfo(setInfo);
        server.onPlayers(setPlayers);

        server.onStdout((out) =>
            setOutput((s) => [...s, { type: "stdout", content: out }])
        );
        server.onStderr((err) =>
            setOutput((s) => [...s, { type: "stderr", content: err }])
        );
    }, []);

    return (
        <div className="overflow-y-hidden">
            <Helmet>
                <title>{`Running server ${info?.info.name ?? ""}`}</title>
            </Helmet>

            <div className="grid grid-cols-3 max-h-full">
                <div className="col-span-1">
                    <h3>Players</h3>
                    <ul>
                        {players.map((p) => (
                            <li key={p}>{p}</li>
                        ))}
                    </ul>
                </div>
                <div className="grid grid-rows-2 h-full max-h-full col-span-2">
                    <div>
                        <h3>Log</h3>
                        <pre className="overflow-scroll rounded-md bg-gray-400 max-h-full scrollbar-thin scrollbar-track-transparent scrollbar-thumb-rounded scrollbar-thumb-blue-700">
                            {output.map((o) => (
                                <div
                                    key={o.content}
                                    className={
                                        o.type === "stderr"
                                            ? "text-red-600"
                                            : ""
                                    }
                                >
                                    {o.content}
                                </div>
                            ))}
                        </pre>
                    </div>
                    <div>
                        <Repl exec={server.rcon} />
                    </div>
                </div>
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
