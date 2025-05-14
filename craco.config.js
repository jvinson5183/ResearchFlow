const webpackConfig = require('./config/webpack.config');

module.exports = {
  webpack: {
    configure: (config) => {
      // Add our webpack fallback for jsx-runtime
      if (config.resolve && config.resolve.fallback) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          ...webpackConfig.resolve.fallback,
        };
      } else if (config.resolve) {
        config.resolve.fallback = webpackConfig.resolve.fallback;
      }
      
      return config;
    },
  },
}; 