import type { IpcMainInvokeEvent } from "electron";
import log from "electron-log";

import https from "https";
import fs from "fs/promises";
import { createWriteStream } from "fs";
import path from "path";
import cp from "child_process";

import { getMainWindow } from "../../index";
import { instancesPath, resourcesPath } from "../constants";
import type { InstanceOptions } from "../../types";
import { fixLog4j, getJarURL, sanitizedDirName } from "./common";
import { getSettings } from "../settings";

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
        const sanitizedName = sanitizedDirName(opts.name);

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
                        `${
                            getSettings().defaultJavaPath ??
                            (opts.javaPath || "java")
                        } -jar ${path.join(
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
        await fixLog4j(opts, instanceRoot);

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
