const { src, dest, series, watch} = require(`gulp`);
const babel = require(`gulp-babel`);
const htmlCompressor = require(`gulp-htmlmin`);
const htmlValidator = require(`gulp-html`);
const jsLinter = require(`gulp-eslint`);
const jsCompressor = require(`gulp-uglify`);
const cssLinter = require (`gulp-stylelint`);
const cssCompressor = require (`gulp-clean-css`);
const browserSync = require(`browser-sync`);
const reload = browserSync.reload;
            },
            extends: `eslint:recommended`
        }))
        .pipe(jsLinter.formatEach(`compact`, process.stderr));

};

let lintCSS = () => {
    return src([`dev/styles/*.css`, `dev/styles/**/*.css`])
        .pipe(cssLinter({
            failAfterError: true,
            reporters: [
                {formatter: `verbose`, console: true}
            ]
        }))
        .pipe(dest(`temp/styles`));
};

let compressCSS = () => {
    return src([`dev/styles/*.css`, `dev/styles/**/*.css`])
        .pipe(cssCompressor())
        .pipe(dest(`prod`));
};

let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 20,
        browser: browserChoice,
        server: {
            baseDir: [
                `temp`,
                `html`
            ]
        }
    });

    watch(`dev/html/**/*.html`,
        series(validateHTML)
    ).on(`change`, reload);

    watch(`dev/scripts/*.js`,
        series(lintJS, transpileJSForDev)
    ).on(`change`, reload);

    watch(`dev/styles/**/*.css`,
        series(lintCSS)
    ).on(`change`, reload);
};

exports.safari = series(safari, serve);
exports.chrome = series(chrome, serve);
exports.allBrowsers = series(allBrowsers, serve);
exports.validateHTML = validateHTML;
exports.compressHTML = compressHTML;
exports.transpileJSForDev = transpileJSForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.lintJS = lintJS;
exports.lintCSS = lintCSS;
exports.compressCSS = compressCSS;
exports.build = series(
    compressHTML,
    transpileJSForProd,
    compressCSS,
    serve
);
exports.serve = series(
    validateHTML,
    lintJS,
    transpileJSForDev,
    lintCSS,
    serve
);
