'use strict';
const { join } = require('path');

module.exports = appInfo => {
  const config = exports = {};

  config.static = {
    prefix: '/public/',
    dir: join(appInfo.baseDir, 'public'),
  };

  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.nj': 'nunjucks',
    },
  };

  config.mysql = {
    // database configuration
    client: {
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: 'root',
      database: 'test',
    },
    // load into app, default is open
    app: true,
    // load into agent, default is close
    agent: false,
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1535524079921_6190';

  // add your config here
  config.middleware = [];

  return config;
};
