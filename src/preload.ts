/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { contextBridge, ipcRenderer } from "electron";
import log from "electron-log";

import {
    getSettings,
    setTheme,
    setDefaultJavaPath,
    setDefaultJvmArgs,
} from "./lib/settings";
import type {
    InstanceInfo,
    IpcChannels,
    ServerIpc,
    IpcSettings,
    MultiserverSettings,
} from "./types";

// theme based on app setting
const theme = getSettings().theme;

window.addEventListener("DOMContentLoaded", () => {
    if (theme === "dark") {
        document.body.classList.add("dark");
    } else if (theme === "light") {
        document.body.classList.remove("dark");
    } else {
        // auto dark/light mode based on OS settings
        const query = matchMedia("(prefers-color-scheme: dark)");
        query.addEventListener("change", (e) => {
            if (e.matches) {
                document.body.classList.add("dark");
            } else {
                document.body.classList.remove("dark");
            }
        });
    }
});

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
} as IpcChannels);

contextBridge.exposeInMainWorld("server", {
    onInfo: (fn: (info: InstanceInfo) => Awaited<void>) => {
        ipcRenderer.on("serverInfo", (event, info) => fn(info));
    },
    onStdout: (fn: (data: string) => Awaited<void>) => {
        ipcRenderer.on("stdout", (event, data) => fn(data));
    },
    onStderr: (fn: (data: string) => Awaited<void>) => {
        ipcRenderer.on("stderr", (event, data) => fn(data));
    },
    onPlayers: (fn: (players: string[]) => Awaited<void>) => {
        ipcRenderer.on("players", (event, players) => fn(players));
    },
    onClose: (fn: () => Awaited<void>) => {
        ipcRenderer.on("close", () => fn());
    },
    onCrash: (fn: (code: number | null) => Awaited<void>) => {
        ipcRenderer.on("crash", (event, code) => fn(code));
    },
    rcon: (command: string) => ipcRenderer.invoke("rcon", command),
} as ServerIpc);

contextBridge.exposeInMainWorld("state", {
    onceInitialState: <T>(fn: (state: T) => Awaited<unknown>) =>
        ipcRenderer.on("initialState", (event, state) => {
            log.debug("recieved state in preload", state);
            fn(state);
        }),
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

contextBridge.exposeInMainWorld("theme", {
    currentTheme: () => getSettings().theme,
    makeDark: () => document.body.classList.add("dark"),
    makeLight: () => document.body.classList.remove("dark"),
});

contextBridge.exposeInMainWorld("settings", {
    get: () =>
        ipcRenderer.invoke("getSettings") as Promise<MultiserverSettings>,
    setTheme: (theme) => ipcRenderer.send("setTheme", theme),
    setDefaultJavaPath: (path) => ipcRenderer.send("setDefaultJavaPath", path),
    setDefaultJvmArgs: (jvmArgs) =>
        ipcRenderer.send("setDefaultJvmArgs", jvmArgs),
} as IpcSettings);
