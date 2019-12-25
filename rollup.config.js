import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import pkg from './package.json'

export default [
  {
    input: './src/index.js',
    output: [{ file: `${pkg.main}`, format: 'cjs' }, { file: `${pkg.module}`, format: 'es' }],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      postcss({
        extensions: ['.css']
      }),
      babel()
    ]
  }
]
