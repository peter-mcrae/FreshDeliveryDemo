/*
 * Define plugins
 */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var jshintStylish = require('jshint-stylish');

var paths = {
    script_page: './js/pages/*.js', 
    script_main: './js/*.js'
};

/*
 * Lint your JavaScript
 */
gulp.task('js-lint', function () {
    return gulp.src(paths.script_page)
        .pipe($.jshint())
        .pipe($.jshint.reporter(jshintStylish));
});

/*
 * Lint your JavaScript
 */
gulp.task('js-lint', function () {
    return gulp.src(paths.script_main)
        .pipe($.jshint())
        .pipe($.jshint.reporter(jshintStylish));
});

/*
 * Beautify your JavaScript
 */
gulp.task('beautify-js', ['js-lint'], function () {
    return gulp.src(paths.script_page)
        .pipe($.jsbeautifier({
            config: '.jsbeautifyrc',
            mode: 'VERIFY_AND_WRITE'
        }))
        .pipe(gulp.dest('./js/pages/'));
});

/*
 * Beautify your JavaScript
 */
gulp.task('beautify-js', ['js-lint'], function () {
    return gulp.src(paths.script_main)
        .pipe($.jsbeautifier({
            config: '.jsbeautifyrc',
            mode: 'VERIFY_AND_WRITE'
        }))
        .pipe(gulp.dest('./js/'));
});

