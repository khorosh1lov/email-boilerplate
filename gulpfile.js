const argv         = require('yargs').argv;
var   responsive   = (argv.responsive !== undefined);

var gulp         = require('gulp'),
    gulpif       = require('gulp-if'),
    del          = require('del'),
    strip        = require('gulp-strip-comments');
    sass         = require('gulp-sass'),
    rename       = require('gulp-rename'),
    imagemin     = require('gulp-imagemin'),
    cache        = require('gulp-cache'),
    inlinesource = require('gulp-inline-source'),
    inlineCss    = require('gulp-inline-css'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('img', function() {
    return gulp.src([
            'dist/images/**/*'
        ])
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [
                {removeViewBox: true},
                {cleanupIDs: true}
            ]
        })))
        .pipe(gulp.dest('src/assets'));
});

gulp.task('sass', function () {
    return gulp.src('dist/sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest("dist/cache"));
});

gulp.task('inline', ['sass'], function () {
    var options = {
        compress: true,
        pretty: true
    };
    var inlineAllStyles =
        gulpif(argv.responsive,
            gulp.src('dist/templates/responsive/responsive.html'),
            gulp.src('dist/templates/basic/basic.html')
        )
        .pipe(inlinesource(options))
        .pipe(strip())
        .pipe(inlineCss({
            removeStyleTags: false,
            removeLinkTags: false,
            applyStyleTags: true,
            applyLinkTags: true,
            applyWidthAttributes: true,
            applyTableAttributes: true,
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('src/'));
});

gulp.task('reset', function() {
    return del.sync('src/*');
});

gulp.task('cache', function () {
    cache.clearAll();
    del.sync('dist/cache/*');
    return console.log('Cache Cleared!');
});

gulp.task('build', [
    'reset',
    'img',
    'inline'
], function() {} );
