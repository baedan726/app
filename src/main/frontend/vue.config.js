module.exports = {
    outputDir: '../webapp/static',
    publicPath: '/static/',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    }
}