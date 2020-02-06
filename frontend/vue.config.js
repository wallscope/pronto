module.exports = {
  devServer: {
    // Proxy to bypass CORS during development
    proxy: 'http://localhost:5050',
  },
  css: {
    loaderOptions: {
      css: {
        sourceMap: true,
      },
      sass: {
        sourceMap: true,
      },
    },
  },
};
