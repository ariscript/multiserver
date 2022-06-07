import "#app.global.css";
import { InstanceInfo } from "#types";
import { DragEventHandler, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { render } from "#lib/render";
import { Delete, Extension } from "@mui/icons-material";
import { Button } from "@mui/material";

const ModsWindow = (): JSX.Element => {
    const [instanceInfo, setInstanceInfo] = useState<InstanceInfo | null>(null);
    const [mods, setMods] = useState<string[]>([]);

    useEffect(() => {
        state.onceInitialState<InstanceInfo>(setInstanceInfo);
    }, []);

    useEffect(() => {
        if (!instanceInfo) return;

        ipc.getMods(instanceInfo).then(setMods);
    }, [instanceInfo]);

    const onDrop: DragEventHandler<HTMLDivElement> = async (e) => {
        e.preventDefault();
        const files: string[] = [];

        for (let i = 0; i < (e.dataTransfer?.items.length ?? 0); i++) {
            const item = e.dataTransfer.items[i];
            if (item.kind === "file") {
                const file = item.getAsFile();
                if (file) files.push(file.path);
            }
        }

        if (instanceInfo) {
            await ipc.copyMods(instanceInfo, files);
            const mods = await ipc.getMods(instanceInfo);
            setMods(mods);
        }
    };

    if (!instanceInfo) return <div>Loading...</div>;

    return (
        <>
            <Helmet>
                <title>{`Mods for ${instanceInfo.info.name ?? ""}`}</title>
            </Helmet>

            <main>
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDrop}
                    className="min-h-[calc(100vh-0.5rem)]"
                >
                    <ul>
                        {mods.map((mod) => (
                            <li
                                key={mod}
                                className="flex flex-row justify-between items-center m-2 border-2 border-gray-700 rounded-md"
                            >
                                <div className="inline-flex flex-row gap-2 p-2">
                                    <Extension />
                                    {mod}
                                </div>
                                <Button
                                    variant="outlined"
                                    className="box-content max-w-[min-content] ml-auto"
                                    onClick={async () => {
                                        await ipc.deleteMod(instanceInfo, mod);
                                        ipc.getMods(instanceInfo).then(setMods);
                                    }}
                                >
                                    <Delete />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="text-center absolute left-0 bottom-0 w-full mb-1">
                    Drag and drop mod files above.
                </p>
            </main>
        </>
    );
};

render(ModsWindow);
