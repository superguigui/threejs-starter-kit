var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');

gulp.task('javascript', function() {
    gulp.src('src/js/**/*.js')
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(concat('app.min.js'))
            /*.pipe(uglify())*/
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build'));
});

gulp.task('vendors', function() {
    gulp.src('src/vendors/**/*.js')
        .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(concat('vendors.js'))
            /*.pipe(uglify())*/
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
    watch('src/js/**/*.js', function() {
        gulp.start('javascript');
    });
    watch('src/vendors/**/*.js', function() {
        gulp.start('vendors');
    });
});

gulp.task('default', ['javascript', 'vendors', 'watch'], function(){});