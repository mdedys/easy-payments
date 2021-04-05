import {SubscriptionMetadata} from "../db/Subscription";

export const Providers = {
  Stripe: "stripe",
};

export default abstract class Provider {
  abstract getSubscription(id: string): Promise<SubscriptionMetadata>;
  abstract createSubscription(metadata: SubscriptionMetadata): Promise<string>;
}
