const path = require('path');
module.exports = function(env) {
    let ret = {
        entry: "./ts/index.tsx",
        output: {
            path: path.join(__dirname, 'src', 'assets'),
            filename: 'app.js'
        },
    }
    ret.mode = env == 'prod' ? 'production': 'development';
    ret.resolve = {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    };
    ret.module = {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
            }
        ]
    };
    return ret;
}