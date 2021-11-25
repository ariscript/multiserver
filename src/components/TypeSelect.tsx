import React, { useState, useEffect } from "react";

import type { InstanceOptions } from "../types";

interface TypeSelectProps {
    value: InstanceOptions["type"];
    onChange: (value: InstanceOptions["type"]) => void;
}

const TypeSelect = ({ value, onChange }: TypeSelectProps): JSX.Element => {
    const getServerTypes = async () => {
        const res = await fetch(
            "https://serverjars.com/api/fetchTypes/servers"
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const data = (await res.json()).response.servers as string[];
        data.push("vanilla", "fabric"); // not returned from serverjars, fabric is handled differently

        return data;
    };

    const [types, setTypes] = useState<string[]>([]);

    useEffect(() => {
        getServerTypes().then(setTypes).catch(console.error);
    }, []);

    return (
        <div>
            <select
                name="server-type"
                value={value}
                onChange={(e) =>
                    onChange(e.target.value as InstanceOptions["type"])
                }
            >
                {types.length === 0 && <option disabled>Loading...</option>}
                {types.length > 0 &&
                    types.map((type) => (
                        <option key={type} value={type}>
                            {type.slice(0, 1).toUpperCase() + type.slice(1)}
                        </option>
                    ))}
            </select>
        </div>
    );
};

export default TypeSelect;
