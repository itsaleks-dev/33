const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const imageminPngquant = require("imagemin-pngquant").default;
const imageminSvgo = require("imagemin-svgo").default;
const newer = require("gulp-newer");
const del = require("del");

function styles() {
  return src("src/scss/style.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

function html() {
  return src("src/*.html")
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

function scripts() {
  return src("src/js/**/*.js")
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream());
}

function images() {
  return src("src/img/**/*.*", { encoding: false })
    .pipe(dest("dist/img"));
}

function clean() {
  return del(["dist/*"]);
}

function serve() {
  browserSync.init({ server: { baseDir: "dist" } });
  watch("src/scss/**/*.scss", styles);
  watch("src/*.html", html);
  watch("src/js/**/*.js", scripts);
  watch("src/img/**/*", images);
}

const build = series(clean, parallel(styles, html, scripts, images));

exports.build = build;
exports.default = series(build, serve);