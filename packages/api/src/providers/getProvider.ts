import Stripe from "./Stripe";

import Provider, {Providers} from "./Providers";

function getProvider(provider: string): Provider {
  switch (provider) {
    case Providers.Stripe:
      return Stripe;
    default:
      throw new Error("Provider is not found");
  }
}

export default getProvider;
