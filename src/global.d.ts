import type { IpcChannels, ServerIpc, IpcState, IpcSettings } from "./types";
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
        state: IpcState;
        store: import("electron-store");
        settings: IpcSettings;
    }
    declare const ipc: IpcChannels;
    declare const server: ServerIpc;
    declare const log: import("electron-log").LogFunctions;
    declare const ipcRenderer: import("electron").IpcRenderer;
    declare const state: IpcState;
    declare const store: import("electron-store");
    declare const settings: IpcSettings;
}
