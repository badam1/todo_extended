module.exports = {
    entry: './src/app.ts',
    output: {
        filename: 'app.js',
        path: __dirname+'/dist'
    },
    devServer: {
        host: '0.0.0.0',
        port: 8080
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'awesome-typescript-loader'
            }
        ]
    }
};