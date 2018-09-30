const config = {
  DB_HOST: 'localhost',
  DB_PORT: 27017,
  DB_OPTIONS: {
    server: {
      socketOptions: {
        keepAlive: 300000,
        connectTimeoutMS: 30000,
      },
    },
    replset: {
      socketOptions: {
        keepAlive: 300000,
        connectTimeoutMS: 30000,
      },
    },
  }
};

module.exports = config;
