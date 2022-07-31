import { getVersions } from "#lib/versions";
import { ipcMain } from "electron";

ipcMain.handle("getVersions", (_e, type: string) => getVersions(type));
