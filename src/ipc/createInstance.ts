import { createInstance } from "#instances/createInstance";
import { ipcMain } from "electron";

ipcMain.handle("createInstance", createInstance);
