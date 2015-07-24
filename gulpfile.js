var gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    path = require('path'),
    Server = require('karma').Server;

gulp.task('build', function () {
    gulp.src(['./*.js', '!./gulpfile.js'])
        .pipe(uglify())
        .pipe(rename('push.min.js'))
        .pipe(gulp.dest('bin'));

    gulp.src(['./*.js', '!./gulpfile.js'])
        .pipe(gulp.dest('bin'));
});

gulp.task('test', function (cb) {
    new Server({
        configFile: path.resolve('karma.conf.js')
    }, cb).start();
});

gulp.task('default', ['build']);
