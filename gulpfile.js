var gulpWorker = require('gulp-worker');


var cssDependencies = [
  "bootstrap/dist/css/bootstrap.css",
];
var jsDependencies = [
  "jquery/dist/jquery.js",
  "bootstrap/dist/js/bootstrap.js",
  "amcharts/dist/amcharts/amcharts.js",
  "amcharts/dist/amcharts/funnel.js",
  "amcharts/dist/amcharts/gantt.js",
  "amcharts/dist/amcharts/gauge.js",
  "amcharts/dist/amcharts/pie.js",
  "amcharts/dist/amcharts/radar.js",
  "amcharts/dist/amcharts/serial.js",
  "amcharts/dist/amcharts/xy.js",
  "d3/d3.js",
  "hy-javascript-utilities/dist/hy.js",
  "knockout/dist/knockout.debug.js",
  "underscore/underscore-min.js"
];

var less = ['visual-sandbox.less'];
var js = ['visual-sandbox.js'];

function justCopyAll(files) {
  for (var i in files) {
    var file = files[i];
    if (typeof (file) != "string")
      continue;
    var fileNameOnly = file.split("/").pop();
    gulpWorker.combine([file], {
      name: fileNameOnly,
      destination: "generators/app/templates/dependencies",
      baseFolder: "bower_components",
      createMinified: "false"
    })
  }
}
justCopyAll(jsDependencies);
justCopyAll(cssDependencies);

gulpWorker.less(less, {
  name: 'visual-sandbox',
  destination: 'generators/app/templates/dependencies',
  baseFolder: 'src/less',
  createMinified: false
});

gulpWorker.js(js, {
  name: 'visual-sandbox',
  destination: 'generators/app/templates/dependencies',
  baseFolder: 'src/js',
  createMinified: false
});
