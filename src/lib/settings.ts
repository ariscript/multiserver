import { app } from "electron";
import Store from "electron-store";
import path from "path";
import type { MultiserverSettings } from "#types";

const store = new Store<MultiserverSettings>();
export { store };

export function getSettings(): MultiserverSettings {
    return {
        theme: store.get("theme"),
        defaultJavaPath: store.get("defaultJavaPath"),
        defaultJvmArgs: store.get("defaultJvmArgs"),
        instancePath: store.get("instancePath"),
    };
}

export function setTheme(theme: MultiserverSettings["theme"]): void {
    if (!theme) return store.delete("theme");
    store.set("theme", theme);
}

export function setDefaultJavaPath(
    defaultJavaPath: MultiserverSettings["defaultJavaPath"]
): void {
    if (!defaultJavaPath) return store.delete("defaultJavaPath");
    store.set("defaultJavaPath", defaultJavaPath);
}

export function setDefaultJvmArgs(
    jvmArgs: MultiserverSettings["defaultJvmArgs"]
): void {
    if (!jvmArgs) return store.delete("defaultJvmArgs");
    store.set("defaultJvmArgs", jvmArgs);
}

export function setInstancePath(
    instancePath: MultiserverSettings["instancePath"]
): void {
    if (!instancePath)
        return store.set(
            "instancePath",
            path.join(app.getPath("userData"), "instances")
        );

    store.set("instancePath", instancePath);
}
