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

export interface MultiserverSettings {
    theme: "dark" | "light" | undefined;
    defaultJavaPath: string | undefined;
    defaultJvmArgs: string | undefined;
}

export interface IpcChannels {
    newInstanceWindow: () => void;
    editInstanceWindow: (name: string) => void;
    settingsWindow: () => void;
    createInstance: (opts: InstanceOptions) => Promise<boolean>;
    closeWindow: () => void;
    getInstances: () => Promise<InstanceInfo[]>;
    editInstance: (name: string, opts: InstanceEditOptions) => Promise<void>;
    runInstance: (name: string) => void;
    openInstance: (name: string) => void;
    deleteInstance: (name: string) => void;
    getDirName: (name: string) => Promise<string>;
    getAvatar: (username: string) => Promise<string>;
    modsWindow: (name: string) => void;
    copyMods: (instance: InstanceInfo, paths: string[]) => Promise<void>;
    getMods: (instance: InstanceInfo) => Promise<string[]>;
    deleteMod: (instance: InstanceInfo, mod: string) => Promise<void>;
    getVersions: (type: string) => Promise<string[]>;
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

export type IpcSettings = {
    [K in keyof MultiserverSettings as `set${Capitalize<K>}`]: (
        p1: MultiserverSettings[K]
    ) => void;
} & {
    get: () => Promise<MultiserverSettings>;
};

export interface Release {
    url: string;
    html_url: string;
    assets_url: string;
    upload_url: string;
    tarball_url: string;
    zipball_url: string;
    id: number;
    node_id: string;
    tag_name: string;
    target_commitish: string;
    name: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
    created_at: Date;
    published_at: Date;
    author: Author;
    assets: Asset[];
}

interface Asset {
    url: string;
    browser_download_url: string;
    id: number;
    node_id: string;
    name: string;
    label: string;
    state: string;
    content_type: string;
    size: number;
    download_count: number;
    created_at: Date;
    updated_at: Date;
    uploader: Author;
}

interface Author {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}
