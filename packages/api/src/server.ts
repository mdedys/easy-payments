import fastify from "fastify";
import Swagger from "fastify-swagger";

import Customers from "./routes/Customers";
import Subscriptions from "./routes/Subscriptions";

const app = fastify({logger: true});

app.get("/", function (_, reply) {
  reply.send({hello: "world"});
});

app.register(Swagger, {
  routePrefix: "/docs",
  openapi: {
    info: {
      title: "Easy Payments",
      description: "API Documentation",
      version: "0.0.1",
    },
    servers: [],
    security: [],
    tags: [],
  },
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  exposeRoute: true,
});

app.register(Customers, {prefix: "api"});
app.register(Subscriptions, {prefix: "api"});

const PORT = process.env.PORT || 3010;

app.listen(PORT, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening on ${address}`);
});
