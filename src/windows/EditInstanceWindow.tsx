import { useState, useEffect, type FormEvent } from "react";
import Helmet from "react-helmet";
import { Button, TextField } from "@mui/material";

import { render } from "#lib/render";
import type { InstanceInfo } from "#types";
import "#app.global.css";

const EditInstanceWindow = () => {
    const [oldName, setOldName] = useState<string>("");
    const [inst, setInst] = useState<InstanceInfo | null>(null);
    const [name, setName] = useState<string>("");
    const [javaPath, setJavaPath] = useState<string>("");
    const [jvmArgs, setJvmArgs] = useState<string>("");

    useEffect(() => {
        state.onceInitialState<{ name: string }>(({ name }) => {
            log.debug("state recieved in component", name);
            setOldName(name);

            ipc.getInstances()
                .then((instance) =>
                    setInst(instance.find((i) => i.info.name === name) ?? null)
                )
                .catch((err) => log.error(err));
        });
    }, []);

    useEffect(() => {
        if (!inst) return;
        if (!name) setName(inst.info.name);
        if (!javaPath) setJavaPath(inst.info.javaPath ?? "");
        if (!jvmArgs) setJvmArgs(inst.info.jvmArgs ?? "");
    }, [inst]);

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await ipc.editInstance(oldName, {
            name: name ?? oldName,
            javaPath,
            jvmArgs,
        });
    };

    return (
        <div className="p-4">
            <Helmet>
                <title>Edit instance {oldName}</title>
            </Helmet>
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
                    value={jvmArgs ?? ""}
                    onChange={(e) => setJvmArgs(e.target.value)}
                />

                <Button type="submit" variant="contained" color="primary">
                    Save
                </Button>
            </form>
        </div>
    );
};

render(EditInstanceWindow);
