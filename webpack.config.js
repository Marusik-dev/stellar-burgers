const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack'); // Добавили webpack

module.exports = {
  mode: process.env.NODE_ENV || 'development', // Добавили mode
  entry: path.resolve(__dirname, './src/index.tsx'),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true // Ускоряет сборку
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.module\.css$/i,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]'
              }
            }
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]'
        }
      }
    ]
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new Dotenv({
      systemvars: true, // Читает также системные переменные
      safe: true, // Загружает .env.example для проверки
      defaults: true // Загружает .env.defaults если есть
    }),
    // Ключевое исправление - явно передаем переменные
    new webpack.DefinePlugin({
      'process.env.BURGER_API_URL': JSON.stringify(
        process.env.BURGER_API_URL || 'https://norma.education-services.ru/api'
      ),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
      '.css',
      '.scss',
      '.png',
      '.svg',
      '.jpg'
    ],
    alias: {
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@ui-pages': path.resolve(__dirname, './src/components/ui/pages'),
      '@utils-types': path.resolve(__dirname, './src/utils/types'),
      '@api': path.resolve(__dirname, './src/utils/burger-api.ts'),
      '@slices': path.resolve(__dirname, './src/services/slices'),
      '@selectors': path.resolve(__dirname, './src/services/selectors')
    }
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: '/', // Важно для правильной работы роутинга
    clean: true // Очищает dist перед каждой сборкой
  },
  devServer: {
    static: {
      directory: path.join(__dirname, './dist'),
    },
    compress: true,
    historyApiFallback: true,
    port: 4000,
    hot: true, // Включаем Hot Module Replacement
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      logging: 'info'
    }
  },
  devtool: 'source-map' // Для отладки
};