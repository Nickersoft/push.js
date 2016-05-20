var
concat = require('gulp-concat'),
del = require('del'),
gulp = require('gulp'),
path = require('path'),
rename = require('gulp-rename'),
Server = require('karma').Server;
uglify = require('gulp-uglify'),

output_dir = "bin";

gulp.task('clean', function () {
    del([output_dir])
});

gulp.task('build', function () {
    gulp.src(['push.js'])
        .pipe(gulp.dest(output_dir));

    gulp.src(['push.js'])
        .pipe(uglify({
            preserveComments: 'license'
        }))
        .pipe(rename('push.min.js'))
        .pipe(gulp.dest(output_dir));
});

gulp.task('test', function (cb) {
    new Server({
        configFile: path.resolve('karma.conf.js')
    }, cb).start();
});

gulp.task('default', ['build', 'test']);
