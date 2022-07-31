import Store from "electron-store";
import type { MultiserverSettings } from "#types";

const store = new Store<MultiserverSettings>();
export { store };

export function getSettings(): MultiserverSettings {
    return {
        theme: store.get("theme") as MultiserverSettings["theme"],
        defaultJavaPath: store.get(
            "defaultJavaPath"
        ) as MultiserverSettings["defaultJavaPath"],
        defaultJvmArgs: store.get(
            "defaultJvmArgs"
        ) as MultiserverSettings["defaultJvmArgs"],
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
