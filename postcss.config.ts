export default {
    plugins: {
        'postcss-nesting': {},
        'postcss-prefixer': {
            prefix: process.env.NODE_ENV === 'production' ? 'green-api-test-' : 'grapi-',
            ignore: [
                /^\.antd?-/,
            ],
            ignoreAndStop: [],
        }
    }
};
