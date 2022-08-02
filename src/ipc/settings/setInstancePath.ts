import { ipcMain } from "electron";
import fs from "fs-extra";
import { getSettings, setInstancePath } from "#lib/settings";
import { getMainWindow } from "../../";

ipcMain.on("setInstancePath", async (_e, instancePath: string) => {
    await fs.copy(getSettings().instancePath, instancePath);
    await fs.rmdir(getSettings().instancePath);

    setInstancePath(instancePath);

    getMainWindow().reload();
});
