import React, { useState, useEffect, type FormEvent } from "react";
import { Button, Select, TextField, MenuItem } from "@mui/material";

import type { MultiserverSettings } from "../types";

import "../app.global.css";
import { render } from "../lib/render";

const SettingsWindow = () => {
    const [settings, setSettings] = useState<MultiserverSettings | null>(null);

    const [theme, setTheme] = useState<MultiserverSettings["theme"]>();
    const [defaultJavaPath, setDefaultJavaPath] =
        useState<MultiserverSettings["defaultJavaPath"]>();
    const [defaultJvmArgs, setDefaultJvmArgs] =
        useState<MultiserverSettings["defaultJvmArgs"]>();

    useEffect(() => {
        window.settings
            .get()
            .then((currentSettings) => {
                console.log(currentSettings);

                setSettings(currentSettings);
                setTheme(currentSettings.theme);
                setDefaultJavaPath(currentSettings.defaultJavaPath);
                setDefaultJvmArgs(currentSettings.defaultJvmArgs);
            })
            .catch((err) => log.error(err));
    }, []);

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // if the value is "", send undefined instead (to delete item)
        window.settings.setTheme(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            theme === "default" ? undefined : theme || undefined
        );
        window.settings.setDefaultJavaPath(defaultJavaPath || undefined);
        window.settings.setDefaultJvmArgs(defaultJvmArgs || undefined);

        ipc.closeWindow();
    };

    return (
        <div className="p-4">
            <h2 className="font-xl font-bold mb-2">Settings</h2>
            <form
                className="flex flex-col container space-y-1"
                onSubmit={handleFormSubmit}
            >
                Theme
                <Select
                    name="theme"
                    value={theme ?? "default"}
                    onChange={(e) =>
                        setTheme(e.target.value as MultiserverSettings["theme"])
                    }
                >
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="default">Default</MenuItem>
                </Select>
                Default Java Path (advanced)
                <TextField
                    name="default-java-path"
                    label="Default Java Path"
                    value={defaultJavaPath}
                    onChange={(e) => setDefaultJavaPath(e.target.value)}
                />
                Default JVM Args (advanced)
                <TextField
                    name="default-jvm-args"
                    label="Default JVM Args"
                    value={defaultJvmArgs}
                    onChange={(e) => setDefaultJvmArgs(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">
                    Save
                </Button>
            </form>
        </div>
    );
};

render(SettingsWindow);
