import tap from "tap";

import getProvider, {
  ProviderNotFoundError,
} from "../../src/providers/getProvider";
import {Providers} from "../../src/providers/Providers";

tap.test("getProvider with existing provider", t => {
  const result = getProvider(Providers.Stripe);
  t.ok(result);
  t.end();
});

tap.test("getProvider with invalid provider", t => {
  t.throws(
    () => getProvider("blah"),
    new ProviderNotFoundError("blah does not exist"),
  );
  t.end();
});
