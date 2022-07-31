import log from "electron-log";
import sanitize from "sanitize-filename";
import { fetch } from "undici";

import https from "https";
import fs from "fs/promises";
import { createWriteStream } from "fs";
import path from "path";

import { InstanceOptions } from "#types";

export function sanitizedDirName(name: string): string {
    return sanitize(name.toLowerCase().replace(/\s/g, "_"));
}

export async function fixLog4j(
    opts: InstanceOptions,
    instanceRoot: string
): Promise<void> {
    const versionMajor = opts.version.split(".").map(Number)[1];

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
}

export async function getJarURL(
    type: string,
    version: string
): Promise<string> {
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
