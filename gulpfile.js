var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var cssmin = require('gulp-minify-css');

gulp.task('js', function() {  
    return gulp.src('src/js/ng-daterange-picker.js')
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('less', function () {
    return gulp.src('src/less/ng-daterange-picker.less')
        .pipe(less())
        .pipe(gulp.dest('dist/css'))
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));
});
gulp.task('watch', function (cb) {
    gulp.watch('src/js/ng-daterange-picker.js', ['js']);
    gulp.watch('src/less/ng-daterange-picker.less', ['less']);
});
gulp.task('default', ['js', 'less']);