import { ipcMain } from "electron";
import { getSettings } from "#lib/settings";

ipcMain.handle("getSettings", getSettings);
