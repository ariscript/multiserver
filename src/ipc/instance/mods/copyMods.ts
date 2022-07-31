import { InstanceInfo } from "#types";
import { ipcMain } from "electron";
import fs from "fs/promises";
import path from "path";

ipcMain.handle(
    "copyMods",
    async (_e, instance: InstanceInfo, paths: string[]) => {
        for (const p of paths) {
            const filename = path.basename(p);
            const destPath = path.join(instance.path, "mods", filename);
            log.debug(`Copying mod ${filename} from ${p} to ${destPath}`);
            await fs.copyFile(p, destPath);
        }
    }
);
