export const Providers = {
  Stripe: "stripe",
};

export default abstract class Provider<T = Record<string, any>> {
  abstract getSubscription(id: string): Promise<T>;
  abstract createSubscription(metadata: T): Promise<string>;
}
