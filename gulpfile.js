var gulp = require('gulp');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');

gulp.task('json', function () {
  gulp.src('data.json')
    .pipe(connect.reload());
});

gulp.task('html', function () {
  gulp.src('index.html')
    .pipe(connect.reload());
});

// 页面自动刷新启动
gulp.task('connect', function() {
    connect.server({
        livereload: true
    });
});

// 监测文件的改动
gulp.task('watch', function() {
    gulp.watch('data.json', ['json']);
    gulp.watch('index.html', ['html']);
});

gulp.task('default', ['connect', 'watch']);




