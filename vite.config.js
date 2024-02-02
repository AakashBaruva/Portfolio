const { resolve } = require('path')

export default {
    root: 'src/',
    publicDir: '../static/',
    base: './',
    server:
    {
        host: true,
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env)
    },
    build:
    {
        rollupOptions: {
            input: {
              main: resolve(__dirname, 'index.html'),
              bigger: resolve(__dirname, 'bigger/bigger.html'),
              big: resolve(__dirname, 'big/big.html'),
              small: resolve(__dirname, 'small/bigger.html'),
              smaller: resolve(__dirname, 'smaller/bigger.html'),
            }},
        outDir: '../dist', 
        emptyOutDir: true, 
        sourcemap: true 
    },
}
