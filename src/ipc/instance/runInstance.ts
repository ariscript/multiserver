import { runInstance } from "#lib/instances/runInstance";
import { app, BrowserWindow, ipcMain, IpcMainEvent } from "electron";

declare const RUN_WINDOW_WEBPACK_ENTRY: string;
declare const RUN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

ipcMain.on("runInstance", (e: IpcMainEvent, name: string) => {
    const runWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            preload: RUN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            sandbox: false,
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
