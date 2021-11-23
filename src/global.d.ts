import { IpcMainInvokeEvent } from "electron";

type IpcChannels = {
    newInstanceWindow: () => void;
    createInstance: () => void;
};

type FunctionParameters<T extends (...args: unknown) => unknown> =
    Parameters<T>;

declare module "electron" {
    namespace Electron {
        interface IpcRenderer {
            send: <T extends keyof IpcChannels>(
                channel: T,
                ...args: FunctionParameters<IpcChannels[T]>
            ) => void;

            invoke: <T extends keyof IpcChannels>(
                channel: T,
                ...args: FunctionParameters<IpcChannels[T]>
            ) => ReturnType<IpcChannels[T]>;
        }

        interface IpcMain {
            on: <T extends keyof IpcChannels>(
                channel: T,
                listener: (
                    ...args: FunctionParameters<IpcChannels[T]>
                ) => unknown
            ) => void;

            once: <T extends keyof IpcChannels>(
                channel: T,
                listener: (
                    ...args: FunctionParameters<IpcChannels[T]>
                ) => unknown
            ) => void;

            removeListener: <T extends keyof IpcChannels>(
                channel: T,
                listener: (
                    ...args: FunctionParameters<IpcChannels[T]>
                ) => unknown
            ) => void;

            removeAllListeners: <T extends keyof IpcChannels>(
                channel?: T
            ) => void;

            handle: <T extends keyof IpcChannels>(
                channel: T,
                listener: (
                    event: IpcMainInvokeEvent,
                    ...args: FunctionParameters<IpcChannels[T]>
                ) => unknown
            ) => void;

            handleOnce: <T extends keyof IpcChannels>(
                channel: T,
                listener: (
                    event: IpcMainInvokeEvent,
                    ...args: FunctionParameters<IpcChannels[T]>
                ) => unknown
            ) => void;

            removeHandler: <T extends keyof IpcChannels>(channel: T) => void;
        }
    }
}

declare global {
    interface Window {
        ipc: IpcChannels;
    }
}
