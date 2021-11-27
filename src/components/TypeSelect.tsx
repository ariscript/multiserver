import { MenuItem, Select } from "@mui/material";
import React, { useState, useEffect } from "react";

import { getServerTypes } from "../lib/versions";
import type { InstanceOptions } from "../types";

interface TypeSelectProps {
    value: InstanceOptions["type"];
    onChange: (value: InstanceOptions["type"]) => void;
}

const TypeSelect = ({ value, onChange }: TypeSelectProps): JSX.Element => {
    const [types, setTypes] = useState<string[]>([]);

    useEffect(() => {
        setTypes(getServerTypes);
    }, []);

    return (
        <div>
            <Select
                name="server-type"
                value={value}
                onChange={(e) =>
                    onChange(e.target.value as InstanceOptions["type"])
                }
            >
                {types.length === 0 && <MenuItem disabled>Loading...</MenuItem>}
                {types.length > 0 &&
                    types.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type.slice(0, 1).toUpperCase() + type.slice(1)}
                        </MenuItem>
                    ))}
            </Select>
        </div>
    );
};

export default TypeSelect;
