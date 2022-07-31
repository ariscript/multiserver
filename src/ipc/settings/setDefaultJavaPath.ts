import { ipcMain } from "electron";
import { setDefaultJavaPath } from "#lib/settings";

ipcMain.on("setDefaultJavaPath", (_e, path: string) =>
    setDefaultJavaPath(path)
);
