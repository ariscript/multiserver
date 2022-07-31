import { getInstances } from "#instances/getInstances";
import { ipcMain, shell } from "electron";

ipcMain.on("openInstance", async (_e, name: string) => {
    const { path: instancePath } =
        (await getInstances()).find((i) => i.info.name === name) ?? {};

    if (!instancePath) throw new Error(`Instance ${name} not found`); // this should never happen

    shell.openPath(instancePath);
});
