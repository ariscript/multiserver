export interface InstanceOptions {
    name: string;
    type:
        | "vanilla"
        | "spigot"
        | "bukkit"
        | "paper"
        | "fabric"
        | "purpur"
        | "tuinity"
        | "fabric";

    version: string;
    javaPath?: string;
    jvmArgs?: string;
}

export type IpcChannels = {
    newInstanceWindow: () => void;
    createInstance: (opts: InstanceOptions) => Promise<boolean>;
};
