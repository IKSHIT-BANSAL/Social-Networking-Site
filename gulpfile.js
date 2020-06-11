const gulp=require('gulp');
const sass=require('gulp-sass');
const cssnano=require('gulp-cssnano');
const rev=require('gulp-rev');
const uglify=require('gulp-uglify-es').default;     //use to minify javascript
const imagemin=require('gulp-imagemin');        //use to minify images
const del=require('del');

//all these files need to be compressed
//this callback function is present gulp.task
gulp.task('css',function(done){
    console.log('Minifying css..');
    //*. it means any file with scss extension
    gulp.src('./assets/sass/**/*.scss')        // ** it means any sub folder inside sass
    //pipe is used to call  all these sub middlewares
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/css'));
           

    gulp.src('./assets/**/*.css')
    .pipe(rev())    //here renaming of file
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({        //it helps in taking file from original assets as it is renamed here
        cwd:'public',       //current working directory
        merge:true          //merge originally existing files
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('js',function(done){
    console.log('Minifying js..');
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    done()
});

gulp.task('images',function(done){
    console.log('compressing images..');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')   //any extensions will add it to this
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

//empty the public/assets directory
gulp.task('clean:assets',function(done){
    del.sync('./public/assets');
    done();
});

gulp.task('build',gulp.series('clean:assets','css','js','images'),function(done){
    console.log('Building assets');
    done();
});
