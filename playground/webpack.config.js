module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: 'index.js',
        path: __dirname + '/out'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {test: /\.tsx?$/, use: 'ts-loader'}
        ]
    },
    devtool: 'source-map',
    devServer: {
        contentBase: __dirname+ '/out',
    }
}