import {SubscriptionMetadata} from "../db/Subscription";
import {CustomerMetadata} from "../db/Customer";

export const Providers = {
  Stripe: "stripe",
};

export type SubscribedCustomer = {
  id: string;
  customerID: string;
  metadata: CustomerMetadata;
};

export default abstract class Provider {
  abstract subscribeCustomer(
    uid: string,
    email: string,
    payment: string,
    subscription: string,
  ): Promise<SubscribedCustomer>;

  abstract getSubscription(id: string): Promise<SubscriptionMetadata>;

  abstract createSubscription(metadata: SubscriptionMetadata): Promise<string>;
}
