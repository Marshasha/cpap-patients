const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target : 'http://localhost:3090',
         //   target : 'http://cpap-auth.jcloud.ik-server.com/',   // production?
            changeOrigin : true,
        })
    );
    app.use(
        '/api2',
        createProxyMiddleware({
            target : 'http://localhost:8181',
         //   target : 'http://cpap-backend.jcloud.ik-server.com', // production?
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
