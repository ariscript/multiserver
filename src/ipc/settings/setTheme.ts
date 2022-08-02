import { setTheme } from "#lib/settings";
import { BrowserWindow, ipcMain } from "electron";

ipcMain.on("setTheme", (_e, theme: "dark" | "light" | undefined) => {
    setTheme(theme);

    const windows = BrowserWindow.getAllWindows();
    windows.forEach((w) => w.webContents.send("themeChange", theme));
});
