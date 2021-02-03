const config = require('../webpack.config');

module.exports = {
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: (defaultConfig) => ({
    ...defaultConfig,
    resolve: { ...defaultConfig.resolve, alias: config.resolve.alias },
    module:{...defaultConfig.module,rules:config.module.rules}
  }),
};
