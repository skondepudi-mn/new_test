const getConfig = require('@modeln/modn-phoenix-ui/craco.config');

const config = getConfig({ nodeModulesPath: './' });

module.exports = {
  ...config
};
