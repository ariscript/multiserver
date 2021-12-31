const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
    module: {
        rules,
    },
    plugins,
    resolve: {
        extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
        plugins: [new TsconfigPathsPlugin()],
    },
    devtool: "source-map",
};
