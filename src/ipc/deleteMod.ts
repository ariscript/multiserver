import { InstanceInfo } from "#types";
import { ipcMain } from "electron";
import fs from "fs/promises";
import path from "path";

ipcMain.handle("deleteMod", async (_e, instance: InstanceInfo, mod: string) => {
    log.debug(
        `Deleting mod ${mod} from ${path.join(instance.path, "mods")}${
            path.sep
        }`
    );
    await fs.rm(path.join(instance.path, "mods", mod));
});
