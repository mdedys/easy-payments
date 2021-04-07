import q from "faunadb";

import db, {FaunaDocument, FaunaRef} from "./FaunaClient";
import {SubscriptionDataProvider} from "./Subscription";
import getProvider from "../providers/getProvider";

export type CustomerMetadata = {
  status: string;
};

// TODO: Should probably store some sort of deleted + disabled status when
// a customer is deleted or removed or is not active anymore due to missed payments

class Customer {
  readonly ref: FaunaRef;
  uid: string;
  email: string;
  subExternalID: string;
  custExternalID: string;
  metadata: CustomerMetadata;

  constructor(
    ref: FaunaRef,
    uid: string,
    email: string,
    subExternalID: string,
    custExternalID: string,
    metadata: CustomerMetadata,
  ) {
    this.ref = ref;
    this.uid = uid;
    this.email = email;
    this.subExternalID = subExternalID;
    this.custExternalID = custExternalID;
    this.metadata = metadata;
  }

  toDict() {
    return {
      id: this.ref.id,
      uid: this.uid,
      email: this.email,
      metadata: this.metadata,
    };
  }
}

export const CustomerDataProvider = {
  async subscribe(
    uid: string,
    email: string,
    payment: string,
    subscriptionID: string,
  ) {
    const subscription = await SubscriptionDataProvider.get(subscriptionID);

    const provider = getProvider(subscription.providerName);

    const result = await provider.subscribeCustomer(
      uid,
      email,
      payment,
      subscription.providerExternalID,
    );

    const customer = await db.query<FaunaDocument>(
      q.Create(q.Collection("customers"), {
        data: {
          uid: uid,
          email: email,
          custExternalID: result.customerID,
          subExternalID: result.id,
        },
      }),
    );

    return new Customer(
      customer.ref,
      uid,
      email,
      result.customerID,
      result.id,
      result.metadata,
    );
  },
};

export default Customer;
