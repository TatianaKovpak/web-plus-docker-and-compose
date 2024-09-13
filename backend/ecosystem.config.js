module.exports = {
  apps: [
    {
      name: 'web-plus-docker-and-compose',
      script: 'dist/main.js',
      watch: false,
      restart_delay: 1000,
      max_restarts: 10,
      autorestart: true,
    },
  ],
};
