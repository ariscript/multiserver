import fs from "fs/promises";
import path from "path";
import type { InstanceInfo, InstanceOptions } from "#types";
import { pathExists } from "#lib/pathExists";
import { getSettings } from "#lib/settings";

export async function getInstances(): Promise<InstanceInfo[]> {
    const instancesPath = getSettings().instancePath;

    if (!(await pathExists(instancesPath))) await fs.mkdir(instancesPath);

    const instances = (await fs.readdir(instancesPath, { withFileTypes: true }))
        .filter((f) => f.isDirectory()) // filter out files like .DS_Store
        .map((f) => f.name);

    return Promise.all(
        instances.map(async (instance) => {
            const conf = await fs.readFile(
                path.join(instancesPath, instance, "multiserver.config.json"),
                "utf8"
            );

            return {
                path: path.join(instancesPath, instance),
                info: JSON.parse(conf) as InstanceOptions,
            };
        })
    );
}
