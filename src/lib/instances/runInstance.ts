import { ipcMain, type IpcMainEvent, type BrowserWindow } from "electron";
import log from "electron-log";

import cp from "child_process";

import { getInstances } from "./getInstances";
import { queryFull, RCON } from "minecraft-server-util";

export async function runInstance(
    _event: IpcMainEvent,
    name: string,
    window: BrowserWindow
): Promise<void> {
    log.debug(`Running instance: ${name}`);

    const instances = await getInstances();
    const instance = instances.find((i) => i.info.name === name);

    if (!instance) {
        log.error(`Instance not found: ${name}`);
        return;
    }

    await new Promise((res) => window.webContents.on("did-finish-load", res));
    window.webContents.send("serverInfo", instance);

    const { info, path } = instance;

    const server = cp.spawn(
        `java ${info.jvmArgs ?? ""} -jar ${
            info.type === "fabric" ? "fabric-server-launch.jar" : "server.jar"
        } nogui`,
        {
            shell: true,
            windowsHide: true,
            cwd: path,
        }
    );

    const rconClient = new RCON();
    let oldPlayers: string[] = [];

    server.stdout.on("data", (data) => {
        log.debug(`SERVER ${info.name} info: ${String(data)}`);

        if (String(data).includes("RCON running on 0.0.0.0:25575")) {
            log.info("Server loading complete, RCON connecting");
            rconClient
                .connect("localhost")
                .then(() => rconClient.login("multiserver"))
                .then(() => log.debug("RCON connected"))
                .catch((err) => log.error(err));
        }

        if (!window.isDestroyed())
            window.webContents.send("stdout", String(data));
    });

    server.stderr.on("data", (data) => {
        log.debug(`SERVER ${info.name} error: ${String(data)}`);
        if (!window.isDestroyed())
            window.webContents.send("stderr", String(data));
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const playerQuery = setInterval(async () => {
        log.debug("interval running");

        try {
            const results = await queryFull("localhost");

            const oldPlayerSet = [...new Set(oldPlayers)];
            const newPlayerSet = [...new Set(results.players.list)];

            // send the server new players list if it has changed
            if (
                oldPlayerSet.length !== newPlayerSet.length ||
                oldPlayerSet.some((p, i) => p !== newPlayerSet[i])
            ) {
                // no need to check if window is destroyed
                // the interval gets cleared before anyway
                // (also it doesn't work if i do the check)
                log.info(`Server ${name}: Player list changed`);
                log.info("Old", oldPlayers);
                log.info("New", results.players.list);

                if (!window.isDestroyed())
                    window.webContents.send("players", results.players.list);
                oldPlayers = results.players.list;
            }
        } catch (e) {
            log.silly(e);
        }
    }, 5000); // query results are cached for 5 seconds by the server

    server.on("close", (code) => {
        rconClient.close().catch((err) => log.error(err));

        log.debug(
            `SERVER ${info.name} closed with exit code ${code ?? "null"}`
        );

        clearInterval(playerQuery);
        ipcMain.removeHandler("rcon");

        if (!window.isDestroyed()) {
            if (code === 0) window.webContents.send("close");
            else window.webContents.send("crash", code);
        }

        server.removeAllListeners();
    });

    window.on("close", () => {
        try {
            server.stdin.write("stop\n");
            rconClient.close().catch((err) => log.error(err));
        } catch {
            server.kill();
        }
    });

    ipcMain.handle("rcon", async (event, command: string) => {
        log.debug(`RCON command to ${info.name}: ${command}`);
        const output = await rconClient.execute(command);
        log.debug(`RCON output from ${info.name}: ${output}`);
        return output;
    });
}
