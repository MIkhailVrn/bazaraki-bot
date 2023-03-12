const { join } = require('path')
const baseConfig = require('../../webpack.base')

module.exports = {
  ...baseConfig,
  entry: '/src/index.ts',
  output: {
    filename: 'index.js',
    path: join(__dirname, '../../dist/tg-bot'),
    libraryTarget: 'commonjs',
  },
}
