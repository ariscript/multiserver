/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { contextBridge, ipcRenderer } from "electron";
import log from "electron-log";
import type { InstanceInfo, IpcChannels, ServerIpc } from "./types";

contextBridge.exposeInMainWorld("ipc", {
    newInstanceWindow: () => ipcRenderer.send("newInstanceWindow"),
    createInstance: (opts) => ipcRenderer.invoke("createInstance", opts),
    closeWindow: () => ipcRenderer.send("closeWindow"),
    getInstances: () => ipcRenderer.invoke("getInstances"),
    runInstance: (name: string) => ipcRenderer.send("runInstance", name),
    openInstance: (name: string) => ipcRenderer.send("openInstance", name),
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
