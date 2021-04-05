import q from "faunadb";

import db, {FaunaDocument, FaunaRef} from "./FaunaClient";
import getProvider from "../providers/getProvider";

export type SubscriptionMetadata = {
  name: string;
  description?: string;
  currency: string;
  price: number;
  interval: "day" | "month" | "week" | "year";
  intervalCount?: number;
  trialPeriodDays?: number;
};

class Subscription {
  readonly ref: FaunaRef;
  providerName: string;
  providerExternalID: string;
  metadata: SubscriptionMetadata;

  constructor(
    ref: FaunaRef,
    providerName: string,
    providerExternalID: string,
    metadata: SubscriptionMetadata,
  ) {
    this.ref = ref;
    this.providerName = providerName;
    this.providerExternalID = providerExternalID;
    this.metadata = metadata;
  }

  toDict() {
    return {
      id: this.ref.id,

      providerName: this.providerName,
      providerExternalID: this.providerExternalID,
      ...this.metadata,
    };
  }
}

export const SubscriptionDataProvider = {
  async get(id: string, providerName: string) {
    const provider = getProvider(providerName);

    const result = await db.query<
      FaunaDocument<{providerName: string; providerExternalID: string}>
    >(q.Get(q.Ref(q.Collection("subscriptions"), id)));

    const metadata = await provider.getSubscription(
      result.data.providerExternalID,
    );

    return new Subscription(
      result.ref,
      result.data.providerName,
      result.data.providerExternalID,
      metadata,
    );
  },

  // TODO: Make metadata more strict
  async create(metadata: SubscriptionMetadata, providerName: string) {
    const provider = getProvider(providerName);
    const providerExternalID = await provider.createSubscription(metadata);

    // TODO: Think about potentially storing some metadata as well
    const result = await db.query<FaunaDocument>(
      q.Create(q.Collection("subscriptions"), {
        data: {providerName, providerExternalID},
      }),
    );

    const subscription = new Subscription(
      result.ref,
      providerName,
      providerExternalID,
      {
        name: metadata.name,
        description: metadata.description || "",
        currency: metadata.currency,
        price: metadata.price,
        interval: "month",
        intervalCount: metadata.intervalCount || 1,
        trialPeriodDays: metadata.trialPeriodDays || 0,
      },
    );

    return subscription;
  },
};

export default Subscription;
