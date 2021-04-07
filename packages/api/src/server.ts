import App from "./app";

const app = App({logger: {prettyPrint: true}});
const PORT = process.env.PORT || 3010;

app.listen(PORT, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening on ${address}`);
});
