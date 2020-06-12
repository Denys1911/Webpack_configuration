const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const getFileName = (isProd, extension = '[ext]') =>
    isProd ? `[name].[contenthash].${extension}` : `[name].${extension}`;

const getStyleLoaders = isProd => [
    isProd ? MiniCssExtractPlugin.loader : 'style-loader',
    'css-loader'
];

const getPlugins = isProd => {
    const plugins = [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            favicon: 'public/favicon.ico'
        })
    ];

    if (isProd) {
        plugins.push(
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: getFileName(true, 'css')
            }),
            new BundleAnalyzerPlugin()
        )
    }

    return plugins;
};

const getOptimizationConfiguration = isProd => {
    const optimizationConfiguration = {
        splitChunks: {
            chunks: 'all'
        }
    };

    if (isProd) {
        optimizationConfiguration.minimize = true;
        optimizationConfiguration.minimizer = [
            new TerserPlugin({
                extractComments: false,
                exclude: /node_modules/,
            }),
            new OptimizeCSSAssetsPlugin()
        ]
    }

    return optimizationConfiguration;
};

module.exports = (env = {}) => {
    const {production: isProd = false} = env;
    const isDev = !isProd;
    const filenameForFileLoader = getFileName(isProd);
    const styleLoaders = getStyleLoaders(isProd);

    return {
        mode: isProd ? 'production' : 'development',
        entry: {
            app: './src/index.js'
        },
        output: {
            filename: getFileName(isProd, 'js'),
            path: path.resolve(__dirname, 'dist')
        },
        devServer: {
            open: true,
            hot: isDev
        },
        devtool : isDev && 'inline-source-maps',
        optimization: getOptimizationConfiguration(isProd),
        plugins: getPlugins(isProd),
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: 'babel-loader'
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader'
                },
                {
                    test: /\.css$/,
                    use: styleLoaders
                },
                {
                    test: /\.s[ac]ss$/,
                    use: [...styleLoaders, 'sass-loader']
                },
                {
                    test: /\.(jpg|png|gif|jpeg|ico)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'images',
                                name: filenameForFileLoader
                            }
                        }
                    ]
                },
                {
                    test: /\.(ttf|woff|woff2|eot|otf)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'fonts',
                                name: filenameForFileLoader
                            }
                        }
                    ]
                }
            ]
        }
    }
};