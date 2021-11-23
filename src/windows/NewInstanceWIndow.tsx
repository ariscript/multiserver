import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import "../app.global.css";

const NewInstanceWindow = () => {
    const getServerTypes = async () => {
        const res = await fetch(
            "https://serverjars.com/api/fetchTypes/servers"
        );
        const data = (await res.json()).response.servers as string[];
        data.push("vanilla", "fabric"); // not returned from serverjars, fabric is handled differently

        return data;
    };

    const getVersions = async (type: string) => {
        if (type === "fabric") {
            const res = await fetch(
                "https://launchermeta.mojang.com/mc/game/version_manifest.json"
            );
            const data = (await res.json()).versions as {
                id: string;
                type: "snapshot" | "release";
                url: string;
                time: string;
                releaseTime: string;
            }[];

            return data
                .filter(
                    (v) =>
                        // we only want releases above 1.14
                        v.type === "release" && Number(v.id.split(".")[1]) >= 14
                )
                .map((v) => v.id); // we only want the release version number
        }

        const res = await fetch(
            `https://serverjars.com/api/fetchAll/${type}/100`
        );
        const data = (await res.json()).response as {
            version: string;
            file: string;
            md5: string;
            bulit: number;
        }[];

        // TODO: sort by version number (newest first)
        return data.map((v) => v.version) as string[];
    };

    const [serverTypes, setServerTypes] = useState<string[]>([]);
    const [selectedServerType, setSelectedServerType] = useState("vanilla");
    const [versions, setVersions] = useState<string[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<string>("");

    useEffect(() => {
        getServerTypes().then(setServerTypes);
    }, []);

    useEffect(() => {
        if (selectedServerType) {
            getVersions(selectedServerType).then(setVersions);
        }
    }, [selectedServerType]);

    return (
        <div>
            <h2>New Instance</h2>
            <select
                name="type"
                value={selectedServerType}
                onChange={(e) => setSelectedServerType(e.target.value)}
            >
                {serverTypes.length === 0 && (
                    <option disabled>Loading...</option>
                )}
                {serverTypes.length > 0 &&
                    serverTypes.map((type) => (
                        <option
                            key={type}
                            value={type}
                            selected={type === "vanilla"}
                        >
                            {type.slice(0, 1).toUpperCase() + type.slice(1)}
                        </option>
                    ))}
            </select>
            <select
                name="version"
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
            >
                {versions.length === 0 && <option disabled>Loading...</option>}
                {versions.length > 0 &&
                    versions.map((version) => (
                        <option key={version} value={version}>
                            {version}
                        </option>
                    ))}
            </select>
            <button onClick={window.ipc.createInstance}>Create</button>
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <NewInstanceWindow />
    </React.StrictMode>,
    document.getElementById("root")
);
