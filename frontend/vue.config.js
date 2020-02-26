module.exports = {
  devServer: {
    // Proxy to bypass CORS during development
    proxy: process.env.API,
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
