import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";

import { InstanceOptions } from "../types";
import fabricLogo from "../../img/fabric_logo.png";
import paperLogo from "../../img/paper_logo.png";
import vanillaLogo from "../../img/vanilla_logo.png";

const images = {
    fabric: fabricLogo,
    paper: paperLogo,
    vanilla: vanillaLogo,
} as const;

interface InstanceProps {
    info: InstanceOptions;
}

const Instance = ({ info }: InstanceProps): JSX.Element => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRun = () => {
        handleClose();
        ipc.runInstance(info.name);
    };

    return (
        <>
            <Button variant="outlined" onClick={handleClick}>
                <div className="flex flex-col align-center items-center">
                    <img src={images[info.type]} width={64} alt={info.type} />
                    <p>{info.name}</p>
                </div>
            </Button>
            <Menu
                id={`instance-${info.name}-options`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>Run</MenuItem>
                <MenuItem onClick={handleClose}>Edit</MenuItem>
                <MenuItem onClick={handleClose}>Delete</MenuItem>
            </Menu>
        </>
    );
};

export default Instance;
