import Stripe from "stripe";

import Provider, {SubscribedCustomer} from "./Providers";
import {SubscriptionMetadata} from "../db/Subscription";

const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2020-08-27",
});

class StripeProvider extends Provider {
  async subscribeCustomer(
    uid: string,
    email: string,
    payment: string,
    subscriptionID: string,
  ): Promise<SubscribedCustomer> {
    const customer = await stripe.customers.create({
      email: email,
      metadata: {uid},
      payment_method: payment,
      invoice_settings: {default_payment_method: payment},
    });

    const customerSubscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{price: subscriptionID}],
    });

    return {
      id: customerSubscription.id,
      customerID: customer.id,
      metadata: {status: customerSubscription.status},
    };
  }

  async getSubscription(id: string): Promise<SubscriptionMetadata> {
    const price = await stripe.prices.retrieve(id);
    const product = await stripe.products.retrieve(price.product as string);
    return {
      name: product.name,
      description: product.description,
      currency: price.currency,
      price: price.unit_amount / 100,
      interval: price.recurring.interval,
      intervalCount: price.recurring.interval_count,
      trialPeriodDays: price.recurring.trial_period_days,
    };
  }

  async createSubscription(metadata: SubscriptionMetadata) {
    const product = await stripe.products.create({
      name: metadata.name,
      description: metadata.description,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: metadata.price * 100,
      currency: metadata.currency,
      recurring: {
        interval: metadata.interval,
        interval_count: metadata.intervalCount,
        trial_period_days: metadata.trialPeriodDays,
      },
    });

    // TODO: Determine if we should be returning price.id or product.id
    return price.id;
  }
}

export default new StripeProvider();
