import type { IpcChannels, ServerIpc } from "./types";
declare global {
    declare module "*.png" {
        const src: string;
        export default src;
    }
    interface Window {
        ipc: IpcChannels;
        server: ServerIpc;
        log: import("electron-log").LogFunctions;
        ipcRenderer: import("electron").IpcRenderer;
    }
    declare const ipc: IpcChannels;
    declare const server: ServerIpc;
    declare const log: import("electron-log").LogFunctions;
    declare const ipcRenderer: import("electron").IpcRenderer;
}
