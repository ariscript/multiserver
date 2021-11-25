/* eslint-disable @typescript-eslint/no-floating-promises */

import { app, BrowserWindow, ipcMain } from "electron";
import updater from "update-electron-app";
import log from "electron-log";

import createInstance from "./instances/createInstance";

// declarations for webpack magic constants for built react code
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const NEW_INSTANCE_WINDOW_WEBPACK_ENTRY: string;
declare const NEW_INSTANCE_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    app.quit();
}

updater();

const createWindow = (): void => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

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
        height: 500,
        width: 400,
        webPreferences: {
            preload: NEW_INSTANCE_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    newInstanceWindow.loadURL(NEW_INSTANCE_WINDOW_WEBPACK_ENTRY);
});

ipcMain.on("closeWindow", (e) => {
    const sender = BrowserWindow.fromWebContents(e.sender);
    log.debug(sender);
    sender?.close();
});

ipcMain.handle("createInstance", createInstance);
