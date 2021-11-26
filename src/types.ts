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

export type IpcChannels = {
    newInstanceWindow: () => void;
    createInstance: (opts: InstanceOptions) => Promise<boolean>;
    closeWindow: () => void;
    getInstances: () => Promise<InstanceInfo[]>;
};
