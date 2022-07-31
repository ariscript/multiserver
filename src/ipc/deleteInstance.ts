import { getMainWindow } from "../";
import { getInstances } from "#instances/getInstances";
import { dialog, ipcMain } from "electron";
import fs from "fs/promises";

ipcMain.on("deleteInstance", async (_e, name: string) => {
    const { response } = await dialog.showMessageBox({
        type: "question",
        buttons: ["Yes", "No"],
        defaultId: 1,
        cancelId: 1,
        title: "Confirm",
        message: `Are you sure you want to delete server ${name}?`,
    });

    if (response !== 0) return;

    const { path: instancePath } =
        (await getInstances()).find((i) => i.info.name === name) ?? {};

    if (!instancePath) throw new Error(`Instance ${name} not found`); // this should never happen

    await fs.rm(instancePath, { recursive: true });

    setTimeout(() => getMainWindow().reload(), 500);
});
