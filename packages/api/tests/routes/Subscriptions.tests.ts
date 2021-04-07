import tap from "tap";

import build from "../../src/app";

tap.test(
  "CREATE - Subscription, missing required body params, expect 400",
  async t => {
    const api = build();

    const response = await api.inject({
      method: "POST",
      url: "/api/subscriptions",
    });

    t.equal(response.statusCode, 400);

    t.end();
  },
);
