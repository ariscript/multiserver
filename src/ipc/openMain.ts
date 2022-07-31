import { ipcMain } from "electron";
import { createWindow } from "../";

ipcMain.on("openMain", createWindow);
