// karma.conf.js
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],

    files: ['tests/**/*.spec.js'],  // Solo los tests como “entry”. El código src se importa desde los tests.

    preprocessors: {
      'tests/**/*.spec.js': ['webpack', 'sourcemap']  // Usando webpack para procesar los tests
    },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',  // Configuración para mapas de origen
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: ['istanbul']  // Para generar cobertura de código
              }
            }
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      resolve: { extensions: ['.js', '.jsx'] }
    },

    reporters: ['progress', 'coverage'],  // Reportes de progreso y cobertura
    coverageReporter: {
      dir: 'coverage',  // Directorio para los reportes de cobertura
      reporters: [
        { type: 'html', subdir: 'html' },  // Reporte visual en HTML
        { type: 'text-summary' }  // Resumen en texto en la consola
      ],
      check: {
        global: {
          statements: 60,  // Umbral de cobertura de sentencias
          branches: 70,  // Umbral de cobertura de ramas
          functions: 60,  // Umbral de cobertura de funciones
          lines: 60  // Umbral de cobertura de líneas
        }
      }
    },

    browsers: ['ChromeHeadless'],  // Usar ChromeHeadless para pruebas automáticas
    singleRun: true,  // Ejecutar Karma solo una vez
    client: { jasmine: { random: false } }  // Desactivar el orden aleatorio de las pruebas (opcional)
  })
}
