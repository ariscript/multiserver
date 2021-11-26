import { app } from "electron";

import path from "path";

export const resourcesPath = app.isPackaged
    ? process.resourcesPath
    : path.join(process.cwd(), "resources");

export const instancesPath = path.join(app.getPath("userData"), "instances");
