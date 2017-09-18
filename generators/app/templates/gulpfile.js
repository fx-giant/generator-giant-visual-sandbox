var gulpWorker = require("gulp-worker");

var less = ["**/*.less"];
var js = ["**/*.js"];
var leesa = ["namespace.js", "leesa*js"];

gulpWorker.less(less, {
    name: "visual-editor",
    destination: "css",
    baseFolder: "src/less",
});

gulpWorker.js(js, {
    name: "visual-editor",
    destination: "js",
    baseFolder: "src/js"
});

gulpWorker.js(leesa, {
    name: "dependencies",
    destination: "js",
    baseFolder: "src/dependencies"
});