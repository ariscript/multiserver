import React from "react";
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
    return (
        <div className="rounded-md border-2 border-gray-800 p-1 m-2 flex flex-col justify-center items-center">
            <img src={images[info.type]} width={64} />
            <p>{info.name}</p>
        </div>
    );
};

export default Instance;
