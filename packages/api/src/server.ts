import fastify from "fastify";

const app = fastify({logger: true});

app.get("/", function (_, reply) {
  reply.send({hello: "world"});
});

const PORT = process.env.PORT || 3010;

app.listen(PORT, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening on ${address}`);
});
