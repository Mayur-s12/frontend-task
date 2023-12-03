const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/transactions/', // Specify the base path for your API calls
    createProxyMiddleware({
      target: 'https://back-su03.onrender.com',
      changeOrigin: true,
    })
  );

  app.use(
    '/statistics/', // Specify the base path for your API calls
    createProxyMiddleware({
      target: 'https://back-su03.onrender.com',
      changeOrigin: true,
    })
  );
};
