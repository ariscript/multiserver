import { useEffect, useState, type FormEvent } from "react";
import { Button, MenuItem, Select, TextField } from "@mui/material";

import { render } from "#lib/render";
import type { MultiserverSettings } from "#types";
import "#app.global.css";

const SettingsWindow = () => {
    const [theme, setTheme] = useState<MultiserverSettings["theme"]>("light");
    const [defaultJavaPath, setDefaultJavaPath] =
        useState<MultiserverSettings["defaultJavaPath"]>("");
    const [defaultJvmArgs, setDefaultJvmArgs] =
        useState<MultiserverSettings["defaultJvmArgs"]>("");
    const [instancePath, setInstancePath] =
        useState<MultiserverSettings["instancePath"]>("");

    useEffect(() => {
        window.settings
            .get()
            .then((currentSettings) => {
                setTheme(currentSettings.theme);
                setDefaultJavaPath(currentSettings.defaultJavaPath);
                setDefaultJvmArgs(currentSettings.defaultJvmArgs);
                setInstancePath(currentSettings.instancePath);
            })
            .catch((err) => log.error(err));
    }, []);

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // if the value is "", send undefined instead (to delete item)
        window.settings.setTheme(
            // @ts-ignore
            theme === "default" ? undefined : theme || undefined
        );
        window.settings.setDefaultJavaPath(defaultJavaPath || undefined);
        window.settings.setDefaultJvmArgs(defaultJvmArgs || undefined);

        log.debug("setting instance path to", instancePath);
        window.settings.setInstancePath(instancePath ?? ""); // will set it to default value if empty

        ipc.closeWindow();
    };

    return (
        <div className="p-4">
            <h2 className="font-2xl font-bold mb-2">Settings</h2>
            <form
                className="flex flex-col container gap-4"
                onSubmit={handleFormSubmit}
            >
                <div className="flex flex-col gap-2">
                    <span>Theme</span>
                    <Select
                        name="theme"
                        value={theme ?? "default"}
                        onChange={(e) =>
                            setTheme(
                                e.target.value as MultiserverSettings["theme"]
                            )
                        }
                    >
                        <MenuItem value="dark">Dark</MenuItem>
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="default">Default</MenuItem>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <span>Server Saves Path</span>
                    <p>
                        Changing this will safely move your current saves to the
                        new location.
                    </p>
                    <TextField
                        name="instances-path"
                        label="Server Saves Path"
                        value={instancePath}
                        onChange={(e) => setInstancePath(e.target.value)}
                    ></TextField>
                </div>
                <div className="flex flex-col gap-2">
                    <span>Default Java Path (advanced)</span>
                    <TextField
                        name="default-java-path"
                        label="Default Java Path"
                        value={defaultJavaPath}
                        onChange={(e) => setDefaultJavaPath(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <span>Default JVM Args (advanced)</span>
                    <TextField
                        name="default-jvm-args"
                        label="Default JVM Args"
                        value={defaultJvmArgs}
                        onChange={(e) => setDefaultJvmArgs(e.target.value)}
                    />
                </div>
                <Button
                    className="mt-2"
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Save
                </Button>
            </form>
        </div>
    );
};

render(SettingsWindow);
