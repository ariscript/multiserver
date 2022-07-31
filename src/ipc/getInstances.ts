import { getInstances } from "#instances/getInstances";
import { ipcMain } from "electron";

ipcMain.handle("getInstances", getInstances);
