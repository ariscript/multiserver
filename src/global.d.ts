import type { IpcChannels } from "./types";

declare global {
    declare module "*.png" {
        const src: string;
        export default src;
    }
    interface Window {
        ipc: IpcChannels;
        log: import("electron-log").LogFunctions;
    }
    declare const ipc: IpcChannels;
    declare const log: import("electron-log").LogFunctions;
}
