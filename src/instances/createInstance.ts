import { app, IpcMainInvokeEvent } from "electron";
import fetch from "node-fetch";
import log from "electron-log";

import https from "https";
import fs from "fs/promises";
import { createWriteStream } from "fs";
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
): Promise<boolean> {
    const instanceRoot = path.join(
        (process.platform === "win32"
            ? process.env.USERPROFILE
            : process.env.HOME) as string,
        ".multiserver",
        "instances",
        opts.name
    );

    const resourcesPath = app.isPackaged
        ? process.resourcesPath
        : path.join(process.cwd(), "resources");

    try {
        log.info(
            `Creating directory for ${opts.type} server instance ${opts.name}`
        );
        await fs.mkdir(instanceRoot, { recursive: true });

        log.silly("Writing configuration file");
        await fs.writeFile(
            path.join(instanceRoot, "multiserver.config.json"),
            JSON.stringify(opts, (v) => v, 4)
        );

        log.silly("Writing eula.txt");
        await fs.writeFile(path.join(instanceRoot, "eula.txt"), "eula=true");

        log.silly("Writing server.properties using 1.17.1 template");
        await fs.copyFile(
            path.join(resourcesPath, "server.properties"),
            path.join(instanceRoot, "server.properties")
        );

        // TODO: check if instance already exists
        // TODO: fabric

        log.info(`Downloading ${opts.type} - ${opts.version} server jar`);

        const jarURL = await getJarURL(opts.type, opts.version);

        log.debug(`Server JAR url: ${jarURL}`);
        https.get(jarURL, (res) => {
            const stream = createWriteStream(
                path.join(instanceRoot, "server.jar")
            );
            res.pipe(stream);
            stream.on("finish", () => stream.close());
        });

        return true;
    } catch (e) {
        log.error(e);
        return false;
    }
}

async function getJarURL(type: string, version: string): Promise<string> {
    if (type === "vanilla") {
        const manifestRes = await fetch(
            "https://launchermeta.mojang.com/mc/game/version_manifest.json"
        );
        const manifest = (await manifestRes.json()) as {
            latest: {
                release: string;
                snapshot: string;
            };
            versions: {
                id: string;
                type: string;
                url: string;
                time: string;
                releaseTime: string;
            }[];
        };

        const versionURL = manifest.versions.find((v) => v.id === version)?.url;

        if (!versionURL) {
            throw new Error(`Could not find version ${version}`);
        }

        const versionInfoRes = await fetch(versionURL);
        const versionInfo = (await versionInfoRes.json()) as {
            // too lazy for the whole type
            downloads: {
                server: {
                    url: string;
                };
            };
        };

        return versionInfo.downloads.server.url;
    } else if (type === "paper") {
        const buildsRes = await fetch(
            `https://papermc.io/api/v2/projects/paper/versions/${version}`
        );
        const buildsInfo = (await buildsRes.json()) as {
            project_id: string;
            project_name: string;
            version: string;
            builds: number[];
        };

        // the newest build number is last
        const buildNumber = buildsInfo.builds[buildsInfo.builds.length - 1];

        const buildInfoRes = await fetch(
            `https://papermc.io/api/v2/projects/paper/versions/${version}/builds/${buildNumber}`
        );
        const buildInfo = (await buildInfoRes.json()) as {
            // again too lazy for the whole type
            downloads: {
                application: {
                    name: string;
                };
            };
        };

        const filename = buildInfo.downloads.application.name;

        return `https://papermc.io/api/v2/projects/paper/versions/${version}/builds/${buildNumber}/downloads/${filename}`;
    }

    throw new TypeError(
        // fabric here in case the user ever sees this
        `invalid server type ${type}, expected "vanilla", "fabric" or "paper"`
    );
}
