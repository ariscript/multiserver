import { contextBridge, ipcRenderer } from "electron";
import log from "electron-log";

import { getSettings } from "#lib/settings";
import type {
    InstanceInfo,
    IpcChannels,
    ServerIpc,
    IpcSettings,
    MultiserverSettings,
} from "./types";

// theme based on app setting
const currentTheme = getSettings().theme;

function watchTheme(theme = currentTheme) {
    if (theme === "dark") {
        document.body.classList.add("dark");
    } else if (theme === "light") {
        document.body.classList.remove("dark");
    } else {
        // auto dark/light mode based on OS settings
        const query = matchMedia("(prefers-color-scheme: dark)");

        if (query.matches) document.body.classList.add("dark");

        query.addEventListener("change", (e) => {
            if (e.matches) {
                document.body.classList.add("dark");
            } else {
                document.body.classList.remove("dark");
            }
        });
    }
}

window.addEventListener("DOMContentLoaded", () => watchTheme());

ipcRenderer.on("themeChange", (e, theme: MultiserverSettings["theme"]) =>
    watchTheme(theme)
);

contextBridge.exposeInMainWorld("ipc", {
    newInstanceWindow: () => ipcRenderer.send("newInstanceWindow"),
    editInstanceWindow: (name: string) =>
        ipcRenderer.send("editInstanceWindow", name),
    settingsWindow: () => ipcRenderer.send("settingsWindow"),
    createInstance: (opts) => ipcRenderer.invoke("createInstance", opts),
    editInstance: (name, opts) => ipcRenderer.send("editInstance", name, opts),
    closeWindow: () => ipcRenderer.send("closeWindow"),
    getInstances: () => ipcRenderer.invoke("getInstances"),
    runInstance: (name: string) => ipcRenderer.send("runInstance", name),
    openInstance: (name: string) => ipcRenderer.send("openInstance", name),
    deleteInstance: (name: string) => ipcRenderer.send("deleteInstance", name),
    getDirName: (name: string) => ipcRenderer.invoke("getDirName", name),
    getAvatar: (username: string) => ipcRenderer.invoke("avatar", username),
    modsWindow: (name: string) => ipcRenderer.send("modsWindow", name),
    copyMods: (instance: InstanceInfo, paths: string[]) =>
        ipcRenderer.invoke("copyMods", instance, paths),
    getMods: (instance: InstanceInfo) =>
        ipcRenderer.invoke("getMods", instance),
    deleteMod: (instance: InstanceInfo, mod: string) =>
        ipcRenderer.invoke("deleteMod", instance, mod),
} as IpcChannels);

contextBridge.exposeInMainWorld("server", {
    onInfo: (fn: (info: InstanceInfo) => Awaited<void>) => {
        ipcRenderer.on("serverInfo", (event, info: InstanceInfo) => fn(info));
    },
    onStdout: (fn: (data: string) => Awaited<void>) => {
        ipcRenderer.on("stdout", (event, data: string) => fn(data));
    },
    onStderr: (fn: (data: string) => Awaited<void>) => {
        ipcRenderer.on("stderr", (event, data: string) => fn(data));
    },
    onPlayers: (fn: (players: string[]) => Awaited<void>) => {
        ipcRenderer.on("players", (event, players: string[]) => fn(players));
    },
    onClose: (fn: () => Awaited<void>) => {
        ipcRenderer.on("close", () => fn());
    },
    onCrash: (fn: (code: number | null) => Awaited<void>) => {
        ipcRenderer.on("crash", (event, code: number | null) => fn(code));
    },
    rcon: (command: string) => ipcRenderer.invoke("rcon", command),
} as ServerIpc);

contextBridge.exposeInMainWorld("state", {
    onceInitialState: <T>(fn: (state: T) => Awaited<unknown>) =>
        ipcRenderer.once("initialState", (event, state: T) => fn(state)),
});

window.onbeforeunload = () => {
    ipcRenderer.removeAllListeners("serverInfo");
    ipcRenderer.removeAllListeners("stdout");
    ipcRenderer.removeAllListeners("stderr");
    ipcRenderer.removeAllListeners("players");
    ipcRenderer.removeAllListeners("close");
    ipcRenderer.removeAllListeners("crash");
};

contextBridge.exposeInMainWorld("log", log.functions);
contextBridge.exposeInMainWorld("ipcRenderer", ipcRenderer);

contextBridge.exposeInMainWorld("settings", {
    get: () =>
        ipcRenderer.invoke("getSettings") as Promise<MultiserverSettings>,
    setTheme: (theme) => ipcRenderer.send("setTheme", theme),
    setDefaultJavaPath: (path) => ipcRenderer.send("setDefaultJavaPath", path),
    setDefaultJvmArgs: (jvmArgs) =>
        ipcRenderer.send("setDefaultJvmArgs", jvmArgs),
} as IpcSettings);
