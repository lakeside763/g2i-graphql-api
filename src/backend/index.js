const { app, config: { port }, shutdown } = require('./server');

const server = app.listen(port, '0.0.0.0', () => console.info(`🚀 Server ready at http://localhost:${port}`)); // eslint-disable-line no-console

process.on('SIGINT', async () => {
  await shutdown(server);
});

process.on('SIGTERM', async () => {
  await shutdown(server);
});
