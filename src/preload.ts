/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { contextBridge, ipcRenderer } from "electron";
import log from "electron-log";
import type { IpcChannels } from "./types";

contextBridge.exposeInMainWorld("ipc", {
    newInstanceWindow: () => ipcRenderer.send("newInstanceWindow"),
    createInstance: (opts) => ipcRenderer.invoke("createInstance", opts),
    closeWindow: () => ipcRenderer.send("closeWindow"),
    getInstances: () => ipcRenderer.invoke("getInstances"),
} as IpcChannels);

contextBridge.exposeInMainWorld("log", log.functions);
