import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
  RouteShorthandOptions,
} from "fastify";

import {SubscriptionDataProvider} from "../db/Subscription";

const SCHEMAS = {
  Responses: {
    Subscription: {
      type: "object",
      properties: {
        id: {type: "string", pattern: "stripe"},
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

// async function get(request: FastifyRequest, reply: FastifyReply) {
//   try {
//     const {id} = request.params as {id: string};
//     const subscription = await SubscriptionDataProvider.
//   } catch (error) {
//     request.log.error(error);
//     throw error;
//   }
// }

const postOptions: RouteShorthandOptions = {
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
  try {
    const {providerName, ...metadata} = request.body as Record<string, any>;

    const subscription = await SubscriptionDataProvider.create(
      metadata,
      providerName,
    );

    reply.status(201).send(subscription.toDict());
  } catch (error) {
    console.log("error: ", error);
    request.log.error(error);
    throw error;
  }
}

export default function (
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error) => void,
) {
  // fastify.post("/get", postOptions, get);
  fastify.post("/subscriptions", postOptions, post);

  done();
}
