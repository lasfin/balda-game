const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const less = require('gulp-less');
const minifyCss = require('gulp-minify-css');
const watch = require('gulp-watch');
const eslint = require('gulp-eslint');

const distFolder = 'dist';


gulp.task('compress-js', () => {
    return gulp.src('js/**/*.js')
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(distFolder));
});


gulp.task('lint', function () {
    return gulp.src(['js/**/*.js'])
        .pipe(eslint({
            extends: 'eslint:recommended',
            envs: ['browser']
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


gulp.task('less', () => {
    return gulp.src('./less/**/*.less')
        .pipe(less())
        .pipe(minifyCss())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(distFolder));
});


gulp.task('watch', () => {
    gulp.watch("js/**/*.js", ['compress-js']);
});


gulp.task('default', ['lint', 'compress-js', 'less', 'watch']);