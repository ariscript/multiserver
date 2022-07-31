import { BrowserWindow, ipcMain } from "electron";

ipcMain.on("setTheme", (_e, theme: "dark" | "light" | undefined) => {
    settings.setTheme(theme);

    const windows = BrowserWindow.getAllWindows();
    windows.forEach((w) => w.webContents.send("themeChange", theme));
});
