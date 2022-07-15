const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target : 'http://localhost:3090',
            changeOrigin : true,
        })
    );
    app.use(
        '/api2',
        createProxyMiddleware({
            target : 'http://localhost:8181',
            changeOrigin : true,
        })
    );
    app.use(
        'api3',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            changeOrigin : true,
        })
    )
};