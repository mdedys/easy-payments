import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";

import {
  SubscriptionDataProvider,
  SubscriptionMetadata,
} from "../db/Subscription";

const SCHEMAS = {
  Responses: {
    Subscription: {
      type: "object",
      properties: {
        id: {type: "string"},
        name: {type: "string"},
        currency: {type: "string"},
        description: {type: "string"},
        price: {type: "number"},
        interval: {type: "string"},
        intervalCount: {type: "number"},
        trialPeriodDays: {type: "number"},
      },
    },
  },
};

const GET_OPTIONS: RouteShorthandOptions = {
  schema: {
    params: {
      type: "object",
      properties: {
        id: {type: "string", description: "Subscription ID"},
      },
    },
    response: {
      200: SCHEMAS.Responses.Subscription,
    },
  },
};

async function get(request: FastifyRequest, reply: FastifyReply) {
  const {id} = request.params as {id: string};
  const subscription = await SubscriptionDataProvider.get(id, "stripe");
  reply.status(200).send(subscription.toDict());
}

const POST_OPTIONS: RouteShorthandOptions = {
  schema: {
    body: {
      type: "object",
      properties: {
        providerName: {type: "string", pattern: "stripe"},
        name: {type: "string"},
        description: {type: "string"},
        price: {type: "number"},
        currency: {type: "string"},
        interval: {type: "string", pattern: "day|week|month|year"},
        intervalCount: {type: "number"},
        trialPeriodDays: {type: "number"},
      },
      required: ["providerName", "name", "price", "currency", "interval"],
    },
    response: {
      201: SCHEMAS.Responses.Subscription,
    },
  },
};

async function post(request: FastifyRequest, reply: FastifyReply) {
  const {providerName, ...metadata} = request.body as Record<string, any>;

  const subscription = await SubscriptionDataProvider.create(
    metadata as SubscriptionMetadata,
    providerName,
  );

  reply.status(201).send(subscription.toDict());
}

export default function (
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error) => void,
) {
  fastify.get("/subscriptions/:id", GET_OPTIONS, get);
  fastify.post("/subscriptions", POST_OPTIONS, post);
  done();
}
