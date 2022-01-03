module.exports = {
    packagerConfig: {
        extraResource: [
            "./resources/server.properties",
            "./resources/fabric-installer.jar",
        ],
    },
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "multiserver",
            },
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: ["darwin", "linux"],
        },
        {
            name: "@electron-forge/maker-deb",
        },
        {
            name: "@electron-forge/maker-dmg",
        },
    ],
    plugins: [
        [
            "@electron-forge/plugin-webpack",
            {
                mainConfig: "./webpack.main.config.js",
                devContentSecurityPolicy:
                    "default-src 'self' 'unsafe-inline' https://fonts.google.com https://fonts.googleapis.com https://fonts.gstatic.com https://launchermeta.mojang.com https://papermc.io data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:",
                renderer: {
                    config: "./webpack.renderer.config.js",
                    entryPoints: [
                        {
                            name: "main_window",
                            html: "./src/index.html",
                            js: "./src/windows/MainWindow.tsx",
                            preload: {
                                js: "./src/preload.ts",
                            },
                        },
                        {
                            name: "new_instance_window",
                            html: "./src/index.html",
                            js: "./src/windows/NewInstanceWindow.tsx",
                            preload: {
                                js: "./src/preload.ts",
                            },
                        },
                        {
                            name: "edit_instance_window",
                            html: "./src/index.html",
                            js: "./src/windows/EditInstanceWindow.tsx",
                            preload: {
                                js: "./src/preload.ts",
                            },
                        },
                        {
                            name: "run_window",
                            html: "./src/index.html",
                            js: "./src/windows/RunWindow.tsx",
                            preload: {
                                js: "./src/preload.ts",
                            },
                        },
                        {
                            name: "settings_window",
                            html: "./src/index.html",
                            js: "./src/windows/SettingsWindow.tsx",
                            preload: {
                                js: "./src/preload.ts",
                            },
                        },
                    ],
                },
            },
        ],
    ],
};
