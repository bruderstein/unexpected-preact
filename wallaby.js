

var Babel = require('babel-core');

module.exports = function (wallaby) {

    return {
        files: [
            {
              pattern: 'src/tests/fixtures/**/*.js',
              instrument: false
            },
            {
              pattern: 'src/tests/fixtures/**/*.snapshot',
              instrument: false
            },
            'src/**/*.js',
            {
                pattern: 'src/tests/**/*.spec.js',
                ignore: true
            },
        ],

        tests: ['src/tests/**/*.spec.js'],
        env: {
            type: 'node',
            runner: 'node'
        },

        compilers: {
            'src/**/*.js': wallaby.compilers.babel({
                babel: Babel
            }),
            'src/**/*.jsx': wallaby.compilers.babel({
                babel: Babel,
                "presets": [ "es2015" ],
                "plugins": [ ["transform-react-jsx", { "pragma": "h" } ] ]
            })
        }
    };
};
