const path = require('path');

// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/register')({
  configFile: path.resolve(__dirname, '../../babel.config.js')
});
