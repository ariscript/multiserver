import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { PlayArrow, Edit, Folder, Delete } from "@mui/icons-material";

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

    const handleOpen = () => {
        handleClose();
        ipc.openInstance(info.name);
    };

    const handleDelete = () => {
        handleClose();
        ipc.deleteInstance(info.name);
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
                <div className="font-[Roboto]">
                    <MenuItem onClick={handleRun}>
                        <PlayArrow />
                        <span className="ml-2">Run</span>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <Edit />
                        <span className="ml-2">Edit</span>
                    </MenuItem>
                    <MenuItem onClick={handleOpen}>
                        <Folder />
                        <span className="ml-2">Open folder</span>
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                        <Delete />
                        <span className="ml-2">Delete</span>
                    </MenuItem>
                </div>
            </Menu>
        </>
    );
};

export default Instance;
