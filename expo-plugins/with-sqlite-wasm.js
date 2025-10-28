module.exports = function withSQLiteWasm(config) {
  return {
    ...config,
    experiments: {
      ...config.experiments,
      turbosnap: false,
    },
    web: {
      ...config.web,
      bundler: "metro",
    },
  };
};
