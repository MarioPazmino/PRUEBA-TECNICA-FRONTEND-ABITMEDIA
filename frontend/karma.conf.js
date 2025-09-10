/**
 * SOLUCIÓN Y DOCUMENTACIÓN DE TESTS Y COVERAGE MULTINAVEGADOR
 *
 * Problema: Karma intenta abrir Chrome por defecto, pero si no está instalado, falla.
 * Solución: Configura la lista de browsers con los navegadores que tienes (Firefox, Edge, Brave).
 *
 * Si Karma no abre el navegador automáticamente:
 *   1. Ejecuta `npx ng test --code-coverage`.
 *   2. Cuando veas el mensaje "No captured browser, open http://localhost:9876/", abre esa URL manualmente en tu navegador preferido.
 *   3. Los tests se ejecutarán y el coverage se generará en la carpeta `coverage/`.
 *   4. El porcentaje de cobertura se verá en el reporte HTML (`coverage/temp-frontend/index.html`).
 *
 * Si quieres que Karma abra el navegador automáticamente:
 *   - Instala Firefox y deja solo 'Firefox' en la lista de browsers.
 *   - O usa la variable de entorno BROWSER (solo en PowerShell):
 *       `$env:BROWSER="Firefox"; npx ng test --code-coverage`
 *
 * Notas:
 * - El coverage es real aunque no salga el porcentaje en consola.
 * - El método manual funciona en cualquier entorno y navegador.
 * - Si editas karma.conf.js, guarda el archivo antes de ejecutar los tests.
 * - Si tienes problemas con esbuild, reinicia el proceso de tests.
 */
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-brave-launcher'),
      require('karma-edge-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
  reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
  autoWatch: false,
  browsers: ['Firefox', 'Edge', 'Brave', 'Chrome'], // Elige automáticamente el navegador disponible
  singleRun: true,
  restartOnFileChange: false
  });
};
