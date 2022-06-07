import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import fetch from "node-fetch";
import cmp from "semver-compare";
import log from "electron-log";

import fs from "fs/promises";
import path from "path";

import { createInstance } from "#lib/instances/createInstance";
import { fixLog4j, sanitizedDirName } from "#lib/instances/common";
import { getInstances } from "#lib/instances/getInstances";
import { runInstance } from "#lib/instances/runInstance";
import { getAvatar } from "#lib/avatar";
import * as settings from "#lib/settings";
import type { InstanceEditOptions, InstanceInfo, Release } from "#types";

// declarations for webpack magic constants for built react code
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const NEW_INSTANCE_WINDOW_WEBPACK_ENTRY: string;
declare const NEW_INSTANCE_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const EDIT_INSTANCE_WINDOW_WEBPACK_ENTRY: string;
declare const EDIT_INSTANCE_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const RUN_WINDOW_WEBPACK_ENTRY: string;
declare const RUN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const MODS_WINDOW_WEBPACK_ENTRY: string;
declare const MODS_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const SETTINGS_WINDOW_WEBPACK_ENTRY: string;
declare const SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    app.quit();
}

let mainWindow: BrowserWindow;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        icon:
            process.platform === "linux"
                ? `${process.resourcesPath}/icon_main.png`
                : undefined,
    });

    if (app.isPackaged) mainWindow.removeMenu();

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
    try {
        const res = await fetch(
            "https://api.github.com/repos/dheerajpv/multiserver/releases"
        );
        const releases = (await res.json()) as Release[];

        const latestStable = releases.find((r) => r.prerelease === false);
        if (!latestStable) {
            throw new Error("No stable release found"); // should not happen
        }

        const releaseNumber = latestStable.tag_name.slice(1);

        if (releaseNumber && cmp(releaseNumber, app.getVersion()) === 1) {
            log.info(
                `New release available: ${releaseNumber}, current: ${app.getVersion()}`
            );

            const { response } = await dialog.showMessageBox({
                type: "info",
                message: `Version ${releaseNumber} of MultiServer is available, but you are running ${app.getVersion()}.\nWould you like to update?`,
                buttons: ["Yes", "No"],
                defaultId: 0,
                title: "Update?",
            });

            if (response === 0 && latestStable) {
                log.info("User accepted update.");
                shell.openExternal(latestStable.html_url);
                process.exit();
            } else {
                log.info("User rejected update.");
            }
        }
    } catch (e) {
        log.error("Update check failed", e);
    }

    createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("newInstanceWindow", () => {
    const newInstanceWindow = new BrowserWindow({
        height: 650,
        width: 500,
        webPreferences: {
            preload: NEW_INSTANCE_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        icon:
            process.platform === "linux"
                ? `${process.resourcesPath}/icon_main.png`
                : undefined,
    });

    if (app.isPackaged) newInstanceWindow.removeMenu();

    newInstanceWindow.loadURL(NEW_INSTANCE_WINDOW_WEBPACK_ENTRY);
});

ipcMain.on("editInstanceWindow", async (e, name: string) => {
    const editWindow = new BrowserWindow({
        height: 600,
        width: 400,
        webPreferences: {
            preload: EDIT_INSTANCE_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        icon:
            process.platform === "linux"
                ? `${process.resourcesPath}/icon_main.png`
                : undefined,
    });

    if (app.isPackaged) editWindow.removeMenu();

    await editWindow.loadURL(EDIT_INSTANCE_WINDOW_WEBPACK_ENTRY);

    log.debug("sending state", { name });

    editWindow.webContents.send("initialState", { name });
});

ipcMain.on("closeWindow", (e) => {
    const sender = BrowserWindow.fromWebContents(e.sender);
    sender?.close();
});

ipcMain.handle("getDirName", (e, name: string) => sanitizedDirName(name));

ipcMain.handle("createInstance", createInstance);
ipcMain.handle("getInstances", getInstances);
ipcMain.on("editInstance", async (e, name: string, i: InstanceEditOptions) => {
    const instances = await getInstances();
    const instance = instances.find((i) => i.info.name === name);
    if (!instance) return;

    const newInstance = { ...instance.info, ...i };

    await fs.writeFile(
        path.join(instance.path, "multiserver.config.json"),
        JSON.stringify(newInstance, null, 2)
    );
    await fixLog4j(newInstance, instance.path);

    BrowserWindow.fromWebContents(e.sender)?.close();
    mainWindow.reload();
});
ipcMain.on("runInstance", (e, name: string) => {
    const runWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            preload: RUN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        icon:
            process.platform === "linux"
                ? `${process.resourcesPath}/icon_main.png`
                : undefined,
    });

    if (app.isPackaged) runWindow.removeMenu();

    runWindow.loadURL(RUN_WINDOW_WEBPACK_ENTRY);

    runInstance(e, name, runWindow);
});
ipcMain.on("openInstance", async (e, name: string) => {
    const { path: instancePath } =
        (await getInstances()).find((i) => i.info.name === name) ?? {};

    if (!instancePath) throw new Error(`Instance ${name} not found`); // this should never happen

    shell.openPath(instancePath);
});
ipcMain.on("deleteInstance", async (e, name: string) => {
    const { response } = await dialog.showMessageBox({
        type: "question",
        buttons: ["Yes", "No"],
        defaultId: 1,
        cancelId: 1,
        title: "Confirm",
        message: `Are you sure you want to delete server ${name}?`,
    });

    if (response !== 0) return;

    const { path: instancePath } =
        (await getInstances()).find((i) => i.info.name === name) ?? {};

    if (!instancePath) throw new Error(`Instance ${name} not found`); // this should never happen

    await fs.rm(instancePath, { recursive: true });

    setTimeout(() => mainWindow.reload(), 500);
});
ipcMain.on("modsWindow", async (e, name: string) => {
    const modsWindow = new BrowserWindow({
        height: 600,
        width: 400,
        webPreferences: {
            preload: MODS_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        icon:
            process.platform === "linux"
                ? `${process.resourcesPath}/icon_main.png`
                : undefined,
    });

    if (app.isPackaged) modsWindow.removeMenu();

    await modsWindow.loadURL(MODS_WINDOW_WEBPACK_ENTRY);

    const instances = await getInstances();
    const instance = instances.find((i) => i.info.name === name);

    modsWindow.webContents.send("initialState", instance);
});

ipcMain.handle("avatar", (e, username: string) => getAvatar(username));

ipcMain.on("settingsWindow", () => {
    const settingsWindow = new BrowserWindow({
        height: 500,
        width: 400,
        webPreferences: {
            preload: SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
        icon:
            process.platform === "linux"
                ? `${process.resourcesPath}/icon_main.png`
                : undefined,
    });

    if (app.isPackaged) settingsWindow.removeMenu();

    settingsWindow.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY);
});

ipcMain.handle("getSettings", settings.getSettings);
ipcMain.on("setTheme", (e, theme: "dark" | "light" | undefined) => {
    settings.setTheme(theme);

    const windows = BrowserWindow.getAllWindows();
    windows.forEach((w) => w.webContents.send("themeChange", theme));
});
ipcMain.on("setDefaultJavaPath", (e, path: string) =>
    settings.setDefaultJavaPath(path)
);
ipcMain.on("setDefaultJvmArgs", (e, args: string) =>
    settings.setDefaultJvmArgs(args)
);

ipcMain.on("openMain", createWindow);

ipcMain.handle(
    "copyMods",
    async (e, instance: InstanceInfo, paths: string[]) => {
        for (const p of paths) {
            const filename = path.basename(p);
            const destPath = path.join(instance.path, "mods", filename);
            log.debug(`Copying mod ${filename} from ${p} to ${destPath}`);
            await fs.copyFile(p, destPath);
        }
    }
);

ipcMain.handle("getMods", async (e, instance: InstanceInfo) => {
    const files = await fs.readdir(path.join(instance.path, "mods"));
    return files.filter((f) => f.endsWith(".jar"));
});

ipcMain.handle("deleteMod", async (e, instance: InstanceInfo, mod: string) => {
    log.debug(
        `Deleting mod ${mod} from ${path.join(instance.path, "mods")}${
            path.sep
        }`
    );
    await fs.rm(path.join(instance.path, "mods", mod));
});

export const getMainWindow = (): BrowserWindow => mainWindow;
