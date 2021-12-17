import React, { useState, type FormEvent } from "react";
import ReactDOM from "react-dom";

import TypeSelect from "../components/TypeSelect";
import VersionSelect from "../components/VersionSelect";
import LabelInput from "../components/LabelInput";
import type { InstanceOptions } from "../types";

import "../app.global.css";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";

const NewInstanceWindow = () => {
    const [name, setName] = useState("");
    const [type, setType] = useState<InstanceOptions["type"]>("vanilla");
    const [version, setVersion] = useState("1.18.1");
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
        <div className="p-4">
            {err && (
                <div className="rounded-md p-2 m-2 w-max bg-red-400">
                    Error creating server. Check Logs for more information.
                </div>
            )}
            <h2 className="font-xl font-bold mb-2">New Instance</h2>
            <form
                onSubmit={handleFormSubmit}
                className="flex container flex-col space-y-1"
            >
                <TextField
                    name="name"
                    label="Name"
                    placeholder="My cool server"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="flex flex-row justify-start space-x-2">
                    <TypeSelect value={type} onChange={setType} />
                    <VersionSelect
                        type={type}
                        value={version}
                        onChange={setVersion}
                    />
                </div>

                <TextField
                    name="java-path"
                    label="Java Path (advanced)"
                    placeholder="java"
                    value={javaPath ?? ""}
                    onChange={(e) => setJavaPath(e.target.value)}
                />

                <TextField
                    name="jvm-args"
                    label="JVM Args (advanced)"
                    placeholder="-Xmx1024M"
                    value={jvmArgs}
                    onChange={(e) => setJvmArgs(e.target.value)}
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                        />
                    }
                    label="I agree to the Mojang EULA"
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!agreed}
                >
                    Create
                </Button>
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
