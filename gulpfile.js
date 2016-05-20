var concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    path = require('path'),
    rename = require('gulp-rename'),
    Server = require('karma').Server;
    uglify = require('gulp-uglify'),

gulp.task('clean', function () {
    del(['dist'])
});

gulp.task('build', function () {
    gulp.src(['push.js'])
        .pipe(gulp.dest('dist'));

    gulp.src(['push.js'])
        .pipe(uglify({
            preserveComments: 'license'
        }))
        .pipe(rename('push.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('test', function (cb) {
    new Server({
        configFile: path.resolve('karma.conf.js')
    }, cb).start();
});

gulp.task('default', ['build', 'test']);
