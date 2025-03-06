const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Remove all console.log calls in production
config.transformer.minifierConfig = {
    compress: {
      drop_console: true,
    },
};

module.exports = config;
