const path = require('path');
const webpack = require('webpack');
var glob = require("glob");
let files = glob.sync("./dll/*.js");
let entry = {};
for (var i = 0; i < files.length; i++) {
    let key = path.basename(files[i], '.js');
    entry[key] = files[i];
}
module.exports = {
    target: 'web',
    entry,
    plugins: [new webpack.IgnorePlugin(/jquery|lodash/)],
    node: { fs: "empty" },
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000
    },
    output: {
        libraryTarget: "var",
        filename: `[name].js`,
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/, options: {
                presets: ["es2015", "stage-0"]
            }
        }]
    }
};