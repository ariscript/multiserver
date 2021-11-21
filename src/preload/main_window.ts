import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("instances", {
  newInstanceWindow: () => {
    ipcRenderer.send("newInstance");
  },
});
