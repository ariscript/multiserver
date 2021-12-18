export interface InstanceOptions {
    name: string;
    type: "vanilla" | "paper" | "fabric";
    version: string;
    javaPath?: string;
    jvmArgs?: string;
}

export interface InstanceInfo {
    path: string;
    info: InstanceOptions;
}

export interface IpcChannels {
    newInstanceWindow: () => void;
    createInstance: (opts: InstanceOptions) => Promise<boolean>;
    closeWindow: () => void;
    getInstances: () => Promise<InstanceInfo[]>;
    runInstance: (name: string) => void;
    openInstance: (name: string) => void;
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
