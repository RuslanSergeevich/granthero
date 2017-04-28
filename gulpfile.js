// Определяем зависимости в переменных
var gulp = require('gulp'),
    //cache = require('gulp-cache'),
    //clean = require('gulp-clean'),
    //stream = require('event-stream'),
    size = require('gulp-size'),
    //jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename');
    //imagemin = require('gulp-imagemin');

// Проверка ошибок в скриптах
gulp.task('lint', function() {
    return gulp.src(['js/*.js', '!js/*.min.js', '!js/*jquery*', '!js/*bootstrap*'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


// Конкатенация и минификация стилей
// При указании исходников в gulp.src учитывается порядок в котором они указаны,
// то есть первыми в итоговом файле будут стили бустрапа, потому что мы должны
// вначале объявить их, чтобы потому переопределить на свои стили 
// То же самое касается скриптов - мы вначале объявляем зависимости и уже потом 
// подключаем наши скрипты (например первым будет всегда jquery, если он используется
// в проекте, а уже следом все остальные скрипты)
gulp.task('styles', function() {
    return gulp.src(['public/css/*bootstrap*', 'public/css/*.css'])
        .pipe(concat('styles.min.css'))
        .pipe(minifyCSS({
            processImport: false,
            keepBreaks: true
        }))
        .pipe(gulp.dest('public/css/min'));
});

// Конкатенация и минификация скриптов
// Тут выделяются два контекста - jquery-плагины / наши скрипты и зависимости (то без чего 
// не будет работать хотя бы один наш скрипт, например jquery)
// Так как это просто пример, то лучшим вариантом было бы разделение на основные и 
// вспомогательные скрипты (например основные - jquery/bootstrap и вспомогательные - lightbox/fotorama) 
gulp.task('scripts', function() {
    var js = gulp.src(['public/js/*.js', 'public/!js/*jquery*', 'public/!js/*bootstrap*'])
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(size({
            title: 'size of custom js'
        }))
        .pipe(gulp.dest('public/js/min'));
    var jsDeps = gulp.src(['public/js/*jquery*', 'public/js/*bootstrap*'])
        .pipe(concat('main.js'))
        .pipe(size({
            title: 'size of js dependencies'
        }))
        .pipe(gulp.dest('public/js/min'));
    //stream.concat(js, jsDeps);
});


// Сжатие изображений (кэшируем, чтобы сжимать только изменившиеся изображения)
// optimizationLevel - это количество проходов, диапазон параметра 0-7 и начиная с 1 включается компрессия
/*gulp.task('images', function () {
    return gulp.src(['images/*', '!images/*.db'])
        .pipe(cache(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })))
        .pipe(size({
            title: 'size of images'
        }))
        .pipe(gulp.dest('production/images'));
});*/

// Чистим директорию назначения и делаем ребилд, чтобы удаленные из проекта файлы не остались
/*gulp.task('clean', function() {
    return gulp.src(['production/css', 'production/js', 'production/images'], {read: false})
        .pipe(clean());
});*/

// Наблюдение за изменениями и автосборка
// После первого запуска (команда gulp в консоли) выполняем gulp watch,
// чтобы следить за изменениями и автоматически пересобирать исходники с учетом
// последних изменений
gulp.task('watch', function() {
    gulp.watch('public/js/*.js', ['lint', 'scripts']);
    gulp.watch('public/css/*.css', ['styles']);
    //gulp.watch('images/*', ['images']);
});

// Выполняем по-умолчанию (вначале очистка и ребилд директории назначения, а потом выполнение остальных задач)
/*gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});*/

gulp.task('default', function() {
    gulp.start('styles', 'scripts');
});