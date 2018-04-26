var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

var browserSync = require('browser-sync').create();

function swallowError (error) {
    console.log(error.toString());
    this.emit('end')
}

gulp.task('serve', ['build-styles-live'], function(gulpCallback) {
    browserSync.init({
        server: './app/',
        open: true
    }, function callback() {
        gulp.watch('app/index.html', browserSync.reload);
        gulp.watch('app/main.js', browserSync.reload);
        gulp.watch('app/style/**/*.scss', ['build-styles-live']);
        gulpCallback();
    });
});

// run sass then stream resulting css to output dir and to BrowserSync
gulp.task('build-styles-live', function() {
    return gulp.src('app/style/**/*.scss')
        .pipe(sass())
        .on('error', swallowError)
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream:true }));
});


gulp.task('copy-app-folder', function() {
    return gulp.src('app/**/*').pipe(gulp.dest('dist'));
});

gulp.task('build', ['copy-app-folder'], function() {
    var plugins = [
        autoprefixer({browsers: ['last 1 version']}),
        cssnano
    ];

    return gulp.src('app/style/**/*.scss')
        .pipe(sass())
        .pipe(postcss(plugins))
        .pipe(gulp.dest('dist/css'))
});
