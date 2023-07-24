const fs = require('fs-extra');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const { version } = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

module.exports = ({ onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.resolve.plugin('tsconfigpaths').use(TsconfigPathsPlugin, [
      {
        configFile: './tsconfig.json',
      },
    ]);

    config.merge({
      node: {
        fs: 'empty',
      },
    });

    config.plugin('index').use(HtmlWebpackPlugin, [
      {
        inject: false,
        minify: false,
        templateParameters: {},
        template: require.resolve('./public/index.html'),
        filename: 'index.html',
      },
    ]);
    config.plugin('edit').use(HtmlWebpackPlugin, [
      {
        inject: false,
        minify: false,
        templateParameters: {
          version,
        },
        template: require.resolve('./public/edit.ejs'),
        filename: 'edit.html',
      },
    ]);
    config.plugin('preview').use(HtmlWebpackPlugin, [
      {
        inject: false,
        minify: false,
        templateParameters: {},
        template: require.resolve('./public/preview.html'),
        filename: 'preview.html',
      },
    ]);

    config.plugins.delete('hot');
    config.devServer.hot(false);
    config.devServer.proxy({
      '/api': {
        // target: 'http://arm1.onlylike.work:3022',
        target: 'http://localhost:3022',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api': '' },
      },
    });

    config.module // fixes https://github.com/graphql/graphql-js/issues/1272
      .rule('mjs$')
      .test(/\.mjs$/)
      .include.add(/node_modules/)
      .end()
      .type('javascript/auto');
    config.module.rule('css').use('postcss-loader').store.get('options').config.path =
      path.resolve('./postcss.config.js');
    // console.log(config.module.rule('css').use('postcss-loader').store.get('options'));
  });
};
