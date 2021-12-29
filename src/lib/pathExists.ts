import fs from "fs/promises";

export const pathExists = (path: string): Promise<boolean> =>
    fs
        .access(path)
        .then(() => true)
        .catch(() => false);
