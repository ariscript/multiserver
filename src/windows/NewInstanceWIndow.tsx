import React, { useState, type FormEvent } from "react";
import ReactDOM from "react-dom";

import TypeSelect from "../components/TypeSelect";
import VersionSelect from "../components/VersionSelect";
import LabelInput from "../components/LabelInput";
import type { InstanceOptions } from "../types";

import "../app.global.css";

const NewInstanceWindow = () => {
    const [name, setName] = useState("");
    const [type, setType] = useState<InstanceOptions["type"]>("vanilla");
    const [version, setVersion] = useState("1.17.1");
    const [javaPath, setJavaPath] = useState<string | undefined>();
    const [jvmArgs, setJvmArgs] = useState("");

    const [agreed, setAgreed] = useState(false);

    const [err, setErr] = useState(false);

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = await ipc.createInstance({
            name,
            type,
            version,
            javaPath,
            jvmArgs,
        });

        log.info(`Status: ${result ? "good" : "bad"}`);

        if (result) {
            ipc.closeWindow();
        } else {
            setErr(true);
        }
    };

    return (
        <div>
            {err && <div className="rounded-md p-2 m-2 w-max bg-red-400">
                Error creating server. Check Logs for more information.
            </div>}
            <h2>New Instance</h2>
            <form onSubmit={handleFormSubmit}>
                <LabelInput
                    name="name"
                    label="Name"
                    placeholder="My cool server"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    labelClassName="mr-2"
                    inputClassName="border-2 p-1"
                />

                <TypeSelect value={type} onChange={setType} />
                <VersionSelect
                    type={type}
                    value={version}
                    onChange={setVersion}
                />

                <LabelInput
                    name="java-path"
                    type="text"
                    placeholder="java"
                    label="Java Path"
                    value={javaPath ?? ""}
                    onChange={(e) => setJavaPath(e.target.value)}
                    labelClassName="mr-2"
                    inputClassName="border-2 p-1"
                />

                <LabelInput
                    name="jvm-args"
                    type="text"
                    placeholder="-Xmx1024M"
                    label="JVM Args"
                    value={jvmArgs}
                    onChange={(e) => setJvmArgs(e.target.value)}
                    labelClassName="mr-2"
                    inputClassName="border-2 p-1"
                />

                <LabelInput
                    name="eula"
                    type="checkbox"
                    label="I agree to the Mojang EULA"
                    value={String(agreed)}
                    onChange={(e) => setAgreed(e.target.checked)}
                    labelClassName="mr-2"
                />

                <button role="button" disabled={!agreed} className={`focus:bg-green-600 ${!agreed ? "bg-gray-500": "bg-green-500"} rounded-md border-2 border-black p-2 transition-colors`}>
                    Create
                </button>
            </form>
        </div>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <NewInstanceWindow />
    </React.StrictMode>,
    document.getElementById("root")
);
