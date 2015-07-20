var gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

gulp.task('build', function () {
    gulp.src(['./src/*.js'])
        .pipe(concat('push.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('bin'));

    gulp.src(['./src/*.js'])
        .pipe(concat('push.js'))
        .pipe(gulp.dest('bin'));
});

gulp.task('default', ['build']);
