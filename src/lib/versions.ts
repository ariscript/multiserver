import cmp from "semver-compare";

export function getServerTypes(): string[] {
    return ["vanilla", "paper", "fabric"];
}

export async function getVersions(type: string): Promise<string[]> {
    if (["fabric", "vanilla"].includes(type)) {
        const res = await fetch(
            "https://launchermeta.mojang.com/mc/game/version_manifest.json"
        );

        const data = (
            (await res.json()) as {
                versions: {
                    id: string;
                    type: "snapshot" | "release";
                    url: string;
                    time: string;
                    releaseTime: string;
                }[];
            }
        ).versions;

        if (type === "fabric")
            return (
                data
                    .filter(
                        (v) =>
                            // we only want releases above 1.14
                            v.type === "release" &&
                            Number(v.id.split(".")[1]) >= 14
                    )
                    // we only want the release version number
                    .map((v) => v.id)
                    .sort(cmp)
                    .reverse()
            );
        else
            return data
                .filter((v) => v.type === "release")
                .map((v) => v.id)
                .sort(cmp)
                .reverse();
    } else if (type === "paper") {
        const res = await fetch("https://papermc.io/api/v2/projects/paper");
        const data = (await res.json()) as {
            project_id: string;
            project_name: string;
            version_groups: string[];
            versions: string[];
        };

        // there are pre-releases in there as well
        return data.versions
            .filter((v) => !/[a-z]/gi.test(v))
            .sort(cmp)
            .reverse();
    }
    return [] as string[];
}
