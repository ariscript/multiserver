import { getAvatar } from "#lib/avatar";
import { ipcMain } from "electron";

ipcMain.handle("avatar", (_e, username: string) => getAvatar(username));
