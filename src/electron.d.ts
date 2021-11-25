// import type { IpcChannels } from "./types";
import "electron";

type FunctionParameters<T extends (...args: unknown) => unknown> =
    Parameters<T>;

declare global {
    namespace Electron {
        export interface IpcRenderer {
            send: <T extends keyof IpcChannels>(
                channel: T,
                ...args: FunctionParameters<import("./types").IpcChannels[T]>
            ) => void;

            invoke: <T extends keyof IpcChannels>(
                channel: T,
                ...args: FunctionParameters<import("./types").IpcChannels[T]>
            ) => ReturnType<import("./types").IpcChannels[T]>;
        }

        export interface IpcMain {
            on: <T extends keyof IpcChannels>(
                channel: T,
                listener: (
                    event: import("electron").IpcMainEvent,
                    ...args: FunctionParameters<
                        import("./types").IpcChannels[T]
                    >
                ) => unknown
            ) => void;

            once: <T extends keyof IpcChannels>(
                channel: T,
                listener: (
                    event: import("electron").IpcMainEvent,
                    ...args: FunctionParameters<
                        import("./types").IpcChannels[T]
                    >
                ) => unknown
            ) => void;

            removeListener: <T extends keyof IpcChannels>(
                channel: T,
                listener: (
                    ...args: FunctionParameters<
                        import("./types").IpcChannels[T]
                    >
                ) => unknown
            ) => void;

            removeAllListeners: <T extends keyof IpcChannels>(
                channel?: T
            ) => void;

            handle: <T extends keyof IpcChannels>(
                channel: T,
                listener: (
                    event: import("electron").IpcMainInvokeEvent,
                    ...args: FunctionParameters<
                        import("./types").IpcChannels[T]
                    >
                ) => ReturnType<import("./types").IpcChannels[T]>
            ) => void;

            handleOnce: <T extends keyof IpcChannels>(
                channel: T,
                listener: (
                    event: import("electron").IpcMainInvokeEvent,
                    ...args: FunctionParameters<
                        import("./types").IpcChannels[T]
                    >
                ) => ReturnType<import("./types").IpcChannels[T]>
            ) => void;

            removeHandler: <T extends keyof IpcChannels>(channel: T) => void;
        }
    }
}
