import fastify, {FastifyServerOptions} from "fastify";
import Swagger from "fastify-swagger";

import Customers from "./routes/Customers";
import Subscriptions from "./routes/Subscriptions";

function build(opts: FastifyServerOptions = {}) {
  const app = fastify(opts);

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

  return app;
}

export default build;
