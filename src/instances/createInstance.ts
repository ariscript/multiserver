import download from "download";
import { app, type IpcMainInvokeEvent } from "electron";
import fs from "fs/promises";
import path from "path";

import type { InstanceOptions } from "../types";

/**
 * Creates a new minecraft server instance
 *
 * @param opts options for the instance
 */
export default async function create(
    _event: IpcMainInvokeEvent,
    opts: InstanceOptions
): Promise<void> {
    const instanceRoot =
        process.platform === "win32"
            ? `${process.env.APPDATA as string}\\MultiServer\\instances\\${
                  opts.name
              }`
            : `${process.env.HOME as string}/.multiserver/instances/${
                  opts.name
              }`;

    const resourcesPath = app.isPackaged ? process.resourcesPath : path.join(process.cwd(), "resources");

    // TODO: check if instance already exists
    // TODO: fabric

    await fs.mkdir(instanceRoot, { recursive: true });
    await fs.writeFile(
        path.join(instanceRoot, "multiserver.config.json"),
        JSON.stringify(opts)
    );
    await fs.writeFile(path.join(instanceRoot, "eula.txt"), "eula=true");
    await fs.copyFile(
        path.join(resourcesPath, "server.properties"),
        path.join(instanceRoot, "server.properties")
    );
    await fs.writeFile(
        path.join(instanceRoot, "server.jar"),
        await download(
            // TODO: use a real not illegal api (didnt know this was illegal)
            `https://serverjars.com/api/fetchJar/${opts.type}/${opts.version}`
        )
    );
}
