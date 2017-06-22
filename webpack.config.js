module.exports = {
    entry: './src/todo_extended.ts',
    output: {
        filename: 'todo_extended.js',
        path: __dirname+'./dist'
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