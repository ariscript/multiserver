import jimp from "jimp";
import fetch from "node-fetch";

interface MojangUserProfileRaw {
    id: string;
    name: string;
    properties: Property[];
}

interface Property {
    name: string;
    value: string;
}

interface MojangUserProfile {
    timestamp: number;
    profileId: string;
    profileName: string;
    textures: Textures;
}

interface Textures {
    SKIN: Cape;
    CAPE: Cape;
}

interface Cape {
    url: string;
}

export async function getAvatar(username: string): Promise<string> {
    const resID = await fetch(
        `https://api.mojang.com/users/profiles/minecraft/${username}`
    );
    const { id: uuid } = (await resID.json()) as {
        id: string;
        username: string;
    };

    const resProfile = await fetch(
        ` https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`
    );
    const { properties } = (await resProfile.json()) as MojangUserProfileRaw;
    const { value: profileRaw } = properties.find(
        (p) => p.name === "textures"
    ) ?? { value: null };

    if (!profileRaw) return "";

    const profile = JSON.parse(atob(profileRaw)) as MojangUserProfile;

    const img = await jimp.read(profile.textures.SKIN.url);
    const img2 = img.clone();

    img.crop(8, 8, 8, 8);
    img2.crop(40, 8, 8, 8);

    img.composite(img2, 0, 0, {
        mode: jimp.BLEND_DESTINATION_OVER,
        opacitySource: 1,
        opacityDest: 1,
    });
    img.resize(64, 64, jimp.RESIZE_NEAREST_NEIGHBOR);

    return img.getBase64Async(jimp.MIME_PNG);
}
