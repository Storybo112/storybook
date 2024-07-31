import { test, describe } from "vitest";

import merge from "./merge";

describe(merge.name, () => {
  test("applies entries not in the source", ({ expect }) => {
    const merged = merge({ a: 1 }, { a: 2, b: 3, c: 4 });
    console.log({ merged });
    expect(merged).toStrictEqual({
      a: 1,
      b: 3,
      c: 4
    });
  });
});
