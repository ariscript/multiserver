import React, { useState, useEffect } from "react";

interface TypeSelectProps {
    value: string;
    onChange: (value: string) => void;
}

const TypeSelect = ({ value, onChange }: TypeSelectProps): JSX.Element => {
    const getServerTypes = async () => {
        const res = await fetch(
            "https://serverjars.com/api/fetchTypes/servers"
        );
        const data = (await res.json()).response.servers as string[];
        data.push("vanilla", "fabric"); // not returned from serverjars, fabric is handled differently

        return data;
    };

    const [types, setTypes] = useState<string[]>([]);

    useEffect(() => {
        getServerTypes().then(setTypes);
    }, []);

    return (
        <div>
            <select
                name="server-type"
                value={value}
                onChange={(e) => onChange(e.target.value)}
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
