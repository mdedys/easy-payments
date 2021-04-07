import Stripe from "./Stripe";

import Provider, {Providers} from "./Providers";

export class ProviderNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderNotFoundError";
  }
}

function getProvider(provider: string): Provider {
  switch (provider) {
    case Providers.Stripe:
      return Stripe;
    default:
      throw new ProviderNotFoundError(`${provider} does not exist`);
  }
}

export default getProvider;
