import React, { useState, useEffect } from "react";

import { getVersions } from "../lib/versions";

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
