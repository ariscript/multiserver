export interface InstanceOptions {
    name: string;
    type: "vanilla" | "paper" | "fabric";
    version: string;
    javaPath?: string;
    jvmArgs?: string;
}

export interface InstanceEditOptions {
    name: string;
    javaPath?: string;
    jvmArgs?: string;
}

export interface InstanceInfo {
    path: string;
    info: InstanceOptions;
}

export interface IpcChannels {
    newInstanceWindow: () => void;
    editInstanceWindow: (name: string) => void;
    createInstance: (opts: InstanceOptions) => Promise<boolean>;
    closeWindow: () => void;
    getInstances: () => Promise<InstanceInfo[]>;
    editInstance: (name: string, opts: InstanceEditOptions) => Promise<void>;
    runInstance: (name: string) => void;
    openInstance: (name: string) => void;
    deleteInstance: (name: string) => void;
    getDirName: (name: string) => Promise<string>;
    getAvatar: (username: string) => Promise<string>;
}

export interface ServerIpc {
    onInfo: (fn: (info: InstanceInfo) => Awaited<void>) => void;
    onStdout: (fn: (data: string) => Awaited<void>) => void;
    onStderr: (fn: (data: string) => Awaited<void>) => void;
    onPlayers: (fn: (players: string[]) => Awaited<void>) => void;
    onClose: (fn: () => Awaited<void>) => void;
    onCrash: (fn: (code: number | null) => Awaited<void>) => void;
    rcon: (command: string) => Promise<string>;
}

export interface IpcState {
    onceInitialState: <T>(fn: (state: T) => Awaited<unknown>) => void;
}
