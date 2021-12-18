import type { IpcMainInvokeEvent } from "electron";
import fetch from "node-fetch";
import log from "electron-log";
import sanitize from "sanitize-filename";

import https from "https";
import fs from "fs/promises";
import { createWriteStream } from "fs";
import path from "path";
import cp from "child_process";

import { getMainWindow } from "../../index";
import { instancesPath, resourcesPath } from "../constants";
import type { InstanceOptions } from "../../types";

/**
 * Creates a new minecraft server instance
 *
 * @param opts options for the instance
 */
export async function createInstance(
    _event: IpcMainInvokeEvent,
    opts: InstanceOptions
): Promise<boolean> {
    try {
        const sanitizedName = sanitize(
            opts.name.toLowerCase().replace(/\s/g, "_")
        );

        if (sanitizedName === "") {
            log.error(`Invalid instance name ${opts.name}`);
            throw new Error(`Invalid instance name ${opts.name}`);
        }

        const instanceRoot = path.join(instancesPath, sanitizedName);

        // TODO: check if instance already exists

        log.info(
            `Creating directory for ${opts.type} server instance ${opts.name}`
        );
        await fs.mkdir(instanceRoot, { recursive: true });

        log.debug("Writing configuration file");
        await fs.writeFile(
            path.join(instanceRoot, "multiserver.config.json"),
            JSON.stringify(opts, undefined, 4)
        );

        log.debug("Writing eula.txt");
        await fs.writeFile(path.join(instanceRoot, "eula.txt"), "eula=true");

        log.debug("Writing server.properties using 1.18.1 template");
        await fs.copyFile(
            path.join(resourcesPath, "server.properties"),
            path.join(instanceRoot, "server.properties")
        );

        if (opts.type === "fabric") {
            log.debug("Calling fabric installer");

            try {
                await new Promise<void>((res, rej) => {
                    const installProcess = cp.spawn(
                        `${opts.javaPath ?? "java"} -jar ${path.join(
                            resourcesPath,
                            "fabric-installer.jar"
                        )} server -dir ${instanceRoot} -mcversion ${
                            opts.version
                        } -downloadMinecraft`,
                        {
                            shell: true,
                            windowsHide: true,
                        }
                    );

                    installProcess.stdout.on("data", (data) => {
                        log.debug(`FABRIC INSTALLER info: ${String(data)}`);
                    });

                    installProcess.stderr.on("data", (data) => {
                        log.debug(`FABRIC INSTALLER error: ${String(data)}`);
                    });

                    installProcess.on("close", (code) => {
                        log.info(
                            `FABRIC INSTALLER exited with code ${
                                code ?? "null"
                            }`
                        );

                        if (code === 0) {
                            res();
                        } else {
                            rej();
                        }
                    });
                });

                log.info("Fabric installer finished");
                log.info("Server creation complete");
                return true;
            } catch (e) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                log.error(`FABRIC INSTALLER failed: ${e}`);
                return false;
            }
        }

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

        // apply fix for log4j vulnerability (CVE-2021-44228)
        const [_, versionMajor] = opts.version.split(".").map(Number);

        if (versionMajor < 18 || opts.version == "1.18") {
            let log4jArg = "";

            if (versionMajor >= 7 && versionMajor <= 11) {
                log.info("Applying log4j fix for 1.7-1.11.2");

                https.get(
                    "https://launcher.mojang.com/v1/objects/4bb89a97a66f350bc9f73b3ca8509632682aea2e/log4j2_17-111.xml",
                    (res) => {
                        const stream = createWriteStream(
                            path.join(instanceRoot, "log4j2_17-111.xml")
                        );
                        res.pipe(stream);
                        stream.on("finish", () => stream.close());
                    }
                );

                log4jArg = "-Dlog4j.configurationFile=log4j2_17-111.xml";
            } else if (versionMajor >= 12 && versionMajor <= 16) {
                log.info("Applying log4j fix for 1.12-1.16.5");

                https.get(
                    "https://launcher.mojang.com/v1/objects/02937d122c86ce73319ef9975b58896fc1b491d1/log4j2_112-116.xml",
                    (res) => {
                        const stream = createWriteStream(
                            path.join(instanceRoot, "log4j2_112-116.xml")
                        );
                        res.pipe(stream);
                        stream.on("finish", () => stream.close());
                    }
                );

                log4jArg = "-Dlog4j.configurationFile=log4j2_112-116.xml";
            } else if (versionMajor === 17 || opts.version === "1.18") {
                log4jArg = "-Dlog4j2.formatMsgNoLookups=true";
            }

            log.debug("Rewriting config file to add log4j fix JVM argument");
            await fs.writeFile(
                path.join(instanceRoot, "multiserver.config.json"),
                JSON.stringify(
                    {
                        ...opts,
                        jvmArgs:
                            (opts.jvmArgs ?? "") +
                            `${
                                (opts.jvmArgs?.length ?? 0) > 0 ? " " : ""
                            }${log4jArg}`,
                    },
                    undefined,
                    4
                )
            );
        }

        log.info("Server creation complete");
        return true;
    } catch (e) {
        log.error(e);
        return false;
    } finally {
        // way less work than having to wire up an IPC event to let the main window know that theres an new instance
        setTimeout(() => getMainWindow().reload(), 500);
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
