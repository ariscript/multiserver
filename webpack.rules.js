module.exports = [
    // Add support for native node modules
    {
        // We're specifying native_modules in the test because the asset relocator loader generates a
        // "fake" .node file which is really a cjs file.
        test: /native_modules\/.+\.node$/,
        use: "node-loader",
    },
    {
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: {
            loader: "@vercel/webpack-asset-relocator-loader",
            options: {
                outputAssetBase: "native_modules",
            },
        },
    },
    {
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
            loader: "ts-loader",
            options: {
                transpileOnly: true,
            },
        },
    },
    {
        test: /\.global\.css$/,
        use: [
            {
                loader: "style-loader",
            },
            {
                loader: "css-loader",
                options: {
                    sourceMap: true,
                },
            },
            {
                loader: "postcss-loader",
                options: {
                    postcssOptions: {
                        plugins: [
                            require("tailwindcss"),
                            require("autoprefixer"),
                        ],
                    },
                },
            },
        ],
    },
    {
        test: /^((?!\.global).)*\.css$/,
        use: [
            {
                loader: "style-loader",
            },
            {
                loader: "css-loader",
                options: {
                    modules: {
                        localIdentName: "[name]__[local]__[hash:base64:5]",
                    },
                    sourceMap: true,
                    importLoaders: 1,
                },
            },
        ],
    },
    {
        test: /\.(png|jpe?g|gif|jp2|webp)$/,
        loader: "file-loader",
        options: {
            name: "[name].[ext]",
        },
    },
];
