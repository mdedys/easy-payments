import q from "faunadb";
import {v4 as uuid} from "uuid";

import db from "./FaunaClient";
import getProvider from "../providers/getProvider";

class Subscription<T> {
  readonly ref: number;
  readonly externalID: string;
  providerName: string;
  providerExternalID: string;
  metadata: T;

  constructor(
    ref: number,
    externalID: string,
    providerName: string,
    providerExternalID: string,
    metadata: T,
  ) {
    this.ref = ref;
    this.externalID = externalID;
    this.providerName = providerName;
    this.providerExternalID = providerExternalID;
    this.metadata = metadata;
  }

  toDict() {
    return {
      id: this.externalID,
      providerName: this.providerName,
      providerExternalID: this.providerExternalID,
      ...this.metadata,
    };
  }
}

export const SubscriptionDataProvider = {
  // TODO: Make metadata more strict
  async create(metadata: Record<string, any>, providerName: string) {
    const provider = getProvider(providerName);

    const externalID = uuid();

    const providerExternalID = await provider.createSubscription(metadata);

    // TODO: Think about only storing providerExternalID + externalID
    // Might not need providerName on each subscription due to org wide settings
    // If multiple providers are supported then we will need it.
    // Metadata may be good to have cached but we will always need to rely on the provider
    // for up to day info.

    const result = await db.query(
      q.Create(q.Collection("subscriptions"), {
        data: {providerName, providerExternalID, externalID, ...metadata},
      }),
    );

    const subscription = new Subscription(
      result["ref"],
      externalID,
      providerName,
      providerExternalID,
      metadata,
    );

    return subscription;
  },
};

export default Subscription;
