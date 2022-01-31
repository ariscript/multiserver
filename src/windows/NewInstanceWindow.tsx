import { useEffect, useState, type FormEvent } from "react";
import { Button, Checkbox, FormControlLabel, TextField } from "@mui/material";

import TypeSelect from "#components/TypeSelect";
import VersionSelect from "#components/VersionSelect";
import { render } from "#lib/render";
import type { InstanceInfo } from "#types";
import "#app.global.css";
import AdvancedOptions from "#components/AdvancedOptions";

const NewInstanceWindow = () => {
    const [name, setName] = useState("");
    const [type, setType] = useState<InstanceInfo["info"]["type"]>("vanilla");
    const [version, setVersion] = useState("1.18.1");
    const [javaPath, setJavaPath] = useState<string | undefined>();
    const [jvmArgs, setJvmArgs] = useState("");

    const [agreed, setAgreed] = useState(false);

    const [err, setErr] = useState("");

    const [instances, setInstances] = useState<InstanceInfo[]>([]);

    const [savePath, setSavePath] = useState("");

    const isWindows = navigator.platform === "Win32";

    useEffect(() => {
        ipc.getInstances()
            .then(setInstances)
            .catch((err) => {
                log.error(err);
                setErr(
                    "There was an error fetching instances. Check logs for details"
                );
            });
    }, []);

    const onNameChange = async (name: string) => {
        setName(name);

        const savePath = await ipc.getDirName(name);
        setSavePath(savePath);

        const dirnames = instances.map(
            (i) => i.path.split(isWindows ? "\\" : "/").reverse()[0]
        );

        if (dirnames.includes(savePath)) {
            setErr(
                "An instance with that name (or saved directory location) already exists.\nTry a different name."
            );
        } else setErr("");
    };

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = await ipc.createInstance({
            name,
            type,
            version,
            javaPath,
            jvmArgs,
        });

        if (result) {
            ipc.closeWindow();
        } else {
            setErr(
                "There was an error creating the instance. Check the log file for more information."
            );
        }
    };

    return (
        <div className="p-4">
            {err && (
                <div className="rounded-md p-2 mx-auto w-full bg-red-400">
                    {err}
                </div>
            )}
            <h2 className="font-2xl font-bold mb-2">New Instance</h2>
            <form
                onSubmit={handleFormSubmit}
                className="flex container flex-col gap-4"
            >
                <TextField
                    name="name"
                    label="Name"
                    placeholder="My cool server"
                    required
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                />
                {savePath ? (
                    <span>
                        Will be saved as{" "}
                        <span className="font-mono">{savePath}</span>
                    </span>
                ) : (
                    <div className="h-6"></div> // empty space to cover text location
                )}

                <div className="flex flex-row justify-start space-x-2">
                    <TypeSelect value={type} onChange={setType} />
                    <VersionSelect
                        type={type}
                        value={version}
                        onChange={setVersion}
                    />
                </div>

                <AdvancedOptions
                    onJavaPathChange={(e) => setJavaPath(e.target.value)}
                    onJvmArgsChange={(e) => setJvmArgs(e.target.value)}
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
                    disabled={!agreed || !!err}
                >
                    Create
                </Button>
            </form>
        </div>
    );
};

render(NewInstanceWindow);
