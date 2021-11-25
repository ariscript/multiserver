import type { IpcChannels } from "./types";

declare global {
    interface Window {
        ipc: IpcChannels;
    }
    declare const ipc: IpcChannels;
}
