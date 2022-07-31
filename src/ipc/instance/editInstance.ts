import { getInstances } from "#instances/getInstances";
import { fixLog4j } from "#instances/common";
import { InstanceEditOptions } from "#types";
import { BrowserWindow, ipcMain } from "electron";
import fs from "fs/promises";
import path from "path";
import { getMainWindow } from "../../";

ipcMain.on(
    "editInstance",
    async (e, name: string, opts: InstanceEditOptions) => {
        const instances = await getInstances();
        const instance = instances.find((i) => i.info.name === name);
        if (!instance) return;

        const newInstance = { ...instance.info, ...opts };

        await fs.writeFile(
            path.join(instance.path, "multiserver.config.json"),
            JSON.stringify(newInstance, null, 2)
        );
        await fixLog4j(newInstance, instance.path);

        BrowserWindow.fromWebContents(e.sender)?.close();
        getMainWindow().reload();
    }
);
