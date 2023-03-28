import { AliasRandom } from "../alias-random.adapter";

describe("Alias Random Test", () => {
  it("should generate a random hash", () => {
    const alias = AliasRandom.generate();
    expect(alias).toHaveLength(6);
    const alias2 = AliasRandom.generate();
    expect(alias2).toHaveLength(6);
    expect(alias).not.toBe(alias2);
  });
});
