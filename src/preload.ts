import { contextBridge, ipcRenderer } from "electron";
import type { IpcChannels } from "./global";

contextBridge.exposeInMainWorld("ipc", {
    newInstanceWindow: () => {
        ipcRenderer.send("newInstanceWindow");
    },
    createInstance: () => {
        ipcRenderer.send("createInstance");
    },
} as IpcChannels);
