import { getInstances } from "#instances/getInstances";
import { app, BrowserWindow, ipcMain } from "electron";

declare const MODS_WINDOW_WEBPACK_ENTRY: string;
declare const MODS_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

ipcMain.on("modsWindow", async (_e, name: string) => {
    const modsWindow = new BrowserWindow({
        height: 600,
        width: 400,
        webPreferences: {
            preload: MODS_WINDOW_PRELOAD_WEBPACK_ENTRY,
            sandbox: false,
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
