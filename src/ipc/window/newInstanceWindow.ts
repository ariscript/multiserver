import { BrowserWindow, app, ipcMain } from "electron";

declare const NEW_INSTANCE_WINDOW_WEBPACK_ENTRY: string;
declare const NEW_INSTANCE_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

ipcMain.on("newInstanceWindow", () => {
    const newInstanceWindow = new BrowserWindow({
        height: 650,
        width: 500,
        webPreferences: {
            preload: NEW_INSTANCE_WINDOW_PRELOAD_WEBPACK_ENTRY,
            sandbox: false,
        },
        icon:
            process.platform === "linux"
                ? `${process.resourcesPath}/icon_main.png`
                : undefined,
    });

    if (app.isPackaged) newInstanceWindow.removeMenu();

    newInstanceWindow.loadURL(NEW_INSTANCE_WINDOW_WEBPACK_ENTRY);
});
