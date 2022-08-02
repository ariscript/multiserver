import { app, BrowserWindow, ipcMain } from "electron";
import log from "electron-log";

declare const EDIT_INSTANCE_WINDOW_WEBPACK_ENTRY: string;
declare const EDIT_INSTANCE_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

ipcMain.on("editInstanceWindow", async (_e, name: string) => {
    const editInstanceWindow = new BrowserWindow({
        height: 600,
        width: 400,
        webPreferences: {
            preload: EDIT_INSTANCE_WINDOW_PRELOAD_WEBPACK_ENTRY,
            sandbox: false,
        },
        icon:
            process.platform === "linux"
                ? `${process.resourcesPath}/icon_main.png`
                : undefined,
    });

    if (app.isPackaged) editInstanceWindow.removeMenu();
    await editInstanceWindow.loadURL(EDIT_INSTANCE_WINDOW_WEBPACK_ENTRY);

    log.debug("sending state", { name });
    editInstanceWindow.webContents.send("initialState", { name });
});
