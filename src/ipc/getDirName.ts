import { sanitizedDirName } from "#lib/instances/common";
import { ipcMain } from "electron";

ipcMain.handle("getDirName", (_e, name: string) => sanitizedDirName(name));
