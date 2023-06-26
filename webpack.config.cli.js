const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BlocklyConcatPlugin = require('./customPlugins/blockly-concat-plugin');
const BlocklyTranslationsPlugin = require('./customPlugins/blockly-translation-plugin');

module.exports = {
    mode: 'production',
    entry: path.join(__dirname, 'src', 'botPage', 'view', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'www'),
        filename: 'index.js',
    },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.(js|jsx|cjs|mjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', { targets: 'defaults' }]],
                    },
                },
            },
            {
                test: /\.(css|scss|sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'image',
                    },
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'public/font',
                    },
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(['www']),
        new Dotenv(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.TRACKJS_TOKEN': JSON.stringify(process.env.TRACKJS_TOKEN),
            'process.env.GD_APP_ID': JSON.stringify(process.env.GD_APP_ID),
            'process.env.GD_CLIENT_ID': JSON.stringify(process.env.GD_CLIENT_ID),
            'process.env.GD_API_KEY': JSON.stringify(process.env.GD_API_KEY),
        }),
        new BlocklyConcatPlugin({
            outputPath: '/',
            fileName: 'blockly.js',
            filesToConcat: [
                './node_modules/blockly/blockly_compressed.js',
                './node_modules/blockly/blocks_compressed.js',
                './node_modules/blockly/javascript_compressed.js',
                './node_modules/blockly/msg/messages.js',
            ],
        }),
        new BlocklyTranslationsPlugin({
            outputPath: path.resolve(__dirname, 'www/translations'),
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
        new webpack.BannerPlugin({
            banner: '#!/usr/bin/env node',
            raw: true,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'node_modules/@deriv/deriv-charts/dist/*.smartcharts.*',
                    to: path.resolve(__dirname, 'www/js', '[name][ext]'),
                },
                {
                    from: 'node_modules/binary-style/src/images/favicons',
                    to: path.resolve(__dirname, 'www/image/favicons'),
                },
                {
                    from: 'public',
                    to: path.resolve(__dirname, 'www/public'),
                },
                {
                    from: 'public/localstorage-sync.html',
                    to: path.resolve(__dirname, 'www'),
                },
                {
                    from: 'templates/index.html',
                    to: path.resolve(__dirname, 'www'),
                },
            ],
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@lang': path.resolve(__dirname, 'src/common/lang'),
            '@config': path.resolve(__dirname, 'src/config'),
        },
    },
    optimization: {
        minimize: true,
    },
};
