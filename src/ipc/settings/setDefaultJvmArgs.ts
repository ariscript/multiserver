import { setDefaultJvmArgs } from "#lib/settings";
import { ipcMain } from "electron";

ipcMain.on("setDefaultJvmArgs", (_e, args: string) => setDefaultJvmArgs(args));
