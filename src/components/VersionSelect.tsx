import React, { useState, useEffect } from "react";

interface VersionSelectProps {
    type: string;
    value: string;
    onChange: (value: string) => void;
}

const VersionSelect = ({
    type,
    value,
    onChange,
}: VersionSelectProps): JSX.Element => {
    const getVersions = async (type: string) => {
        if (type === "fabric") {
            const res = await fetch(
                "https://launchermeta.mojang.com/mc/game/version_manifest.json"
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const data = (await res.json()).response as {
            version: string;
            file: string;
            md5: string;
            bulit: number;
        }[];

        return data.map((v) => v.version);
    };

    const [versions, setVersions] = useState<string[]>([]);

    useEffect(() => {
        if (type) {
            getVersions(type).then(setVersions).catch(console.error);
        }
    }, [type]);

    return (
        <div>
            <select
                name="version"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {versions.length === 0 && <option disabled>Loading...</option>}
                {versions.length > 0 &&
                    versions.map((version) => (
                        <option key={version} value={version}>
                            {version}
                        </option>
                    ))}
            </select>
        </div>
    );
};

export default VersionSelect;
