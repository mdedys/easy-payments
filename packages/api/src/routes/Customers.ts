import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import {CustomerDataProvider} from "../db/Customer";

const POST_OPTIONS = {
  schema: {
    body: {
      type: "object",
      properties: {
        uid: {
          type: "string",
          description: "Unique identifier for the customer",
        },
        email: {
          type: "string",
          description: "Customer Email",
        },
        payment: {
          type: "string",
          description: "PaymentMethod ID Token",
        },
        subscription: {
          type: "string",
          description: "Subscription ID",
        },
      },
    },
  },
};

type CreateCustomerPayload = {
  uid: string;
  email: string;
  payment: string;
  subscription: string;
};

async function post(request: FastifyRequest, reply: FastifyReply) {
  const data = request.body as CreateCustomerPayload;

  const customer = await CustomerDataProvider.subscribe(
    data.uid,
    data.email,
    data.payment,
    data.subscription,
  );

  reply.status(201).send(customer.toDict());
}

export default function (
  fastify: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error) => void,
) {
  fastify.post("/customers", POST_OPTIONS, post);
  done();
}
