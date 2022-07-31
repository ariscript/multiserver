import { BrowserWindow, ipcMain, IpcMainEvent } from "electron";

ipcMain.on("closeWindow", (e: IpcMainEvent) => {
    const sender = BrowserWindow.fromWebContents(e.sender);
    sender?.close();
});
