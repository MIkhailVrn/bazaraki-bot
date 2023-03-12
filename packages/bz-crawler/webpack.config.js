const { join } = require('path')
const baseConfig = require('../../webpack.base')

module.exports = {
  ...baseConfig,
  entry: '/src/index.ts',
  externals: {
    canvas: 'commonjs canvas',
  },
  output: {
    filename: 'index.js',
    path: join(__dirname, '../../dist/bz-crawler'),
    libraryTarget: 'commonjs',
  },
}
