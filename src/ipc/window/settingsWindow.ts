import { app, BrowserWindow, ipcMain } from "electron";

declare const SETTINGS_WINDOW_WEBPACK_ENTRY: string;
declare const SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

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
