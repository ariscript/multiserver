import React, { useState, useEffect } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { Gavel, ExitToApp } from "@mui/icons-material";

interface PlayerProps {
    username: string;
}

const Player = ({ username }: PlayerProps): JSX.Element => {
    const [avatar, setAvatar] = useState<string | null>(null);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        ipc.getAvatar(username)
            .then(setAvatar)
            .catch((err) => log.error(err));
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleBan = async () => {
        handleClose();
        await server.rcon(`ban ${username}`);
    };

    const handleKick = async () => {
        handleClose();
        await server.rcon(`kick ${username}`);
    };

    return (
        <div className="ml-3">
            <Button variant="outlined" onClick={handleClick}>
                <div className="flex flex-row items-start justify-center">
                    {avatar && (
                        <img
                            src={avatar}
                            alt={`${username}'s head`}
                            width={32}
                        />
                    )}
                    <div className="ml-4 my-auto">{username}</div>
                </div>
            </Button>
            <Menu
                id={`player-${username}-options`}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleKick}>
                    <ExitToApp />
                    <span className="ml-2">Kick</span>
                </MenuItem>
                <MenuItem onClick={handleBan}>
                    <Gavel />
                    <span className="ml-2">Ban</span>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default Player;
