import { InstanceInfo } from "#types";
import { ipcMain } from "electron";
import fs from "fs/promises";
import path from "path";

ipcMain.handle("getMods", async (_e, instance: InstanceInfo) => {
    const files = await fs.readdir(path.join(instance.path, "mods"));
    return files.filter((f) => f.endsWith(".jar"));
});
