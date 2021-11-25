/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { contextBridge, ipcRenderer } from "electron";
import type { IpcChannels } from "./types";

contextBridge.exposeInMainWorld("ipc", {
    newInstanceWindow: () => {
        ipcRenderer.send("newInstanceWindow");
    },
    createInstance: (opts) => ipcRenderer.invoke("createInstance", opts),
} as IpcChannels);
