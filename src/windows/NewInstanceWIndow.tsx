import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import TypeSelect from "../components/TypeSelect";

import "../app.global.css";

const NewInstanceWindow = () => {
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

    const [selectedServerType, setSelectedServerType] = useState("vanilla");
    const [versions, setVersions] = useState<string[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<string>("");

    useEffect(() => {
        if (selectedServerType) {
            getVersions(selectedServerType).then(setVersions);
        }
    }, [selectedServerType]);

    return (
        <div>
            <h2>New Instance</h2>
            <TypeSelect
                value={selectedServerType}
                onChange={setSelectedServerType}
            />
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
            <button onClick={ipc.createInstance}>Create</button>
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <NewInstanceWindow />
    </React.StrictMode>,
    document.getElementById("root")
);
