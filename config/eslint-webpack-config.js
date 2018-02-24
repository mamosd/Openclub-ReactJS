import path from 'path'
import nodeExternals from 'webpack-node-externals'
// NEVER ACTUALLY USED —— THIS IS PURELY DEV ONLY
const rootDir = path.join(__dirname, '../src')

export default {
  context: rootDir,
  resolve: {
    root: [
      path.join(rootDir, '/src')
    ],
    extensions: ['', '.js', '.json', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  externals: [nodeExternals()]
}
