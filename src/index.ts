import { app, BrowserWindow, dialog, shell } from "electron";
import { fetch } from "undici";
import cmp from "semver-compare";
import log from "electron-log";
import path from "path";
import { Release } from "#types";
import { getSettings, setInstancePath } from "#lib/settings";

// declarations for webpack magic constants for built react code
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    app.quit();
}

let mainWindow: BrowserWindow;

export const createWindow = () => {
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

    if (!getSettings().instancePath)
        setInstancePath(path.join(app.getPath("userData"), "instances"));

    log.debug(getSettings().instancePath);

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
import "./ipc";

export const getMainWindow = (): BrowserWindow => mainWindow;
