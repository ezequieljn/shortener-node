import { ShortenerValidate } from "./shortener.validator";

describe("Shortener Validate Schema", () => {
  it("should return that the values are mandatory", async () => {
    const validate = new ShortenerValidate({});
    validate.validate();
    expect(validate.errors()).toStrictEqual([
      { url: '"url" is required' },
      { alias: '"alias" is required' },
      { visitor_counter: '"visitor_counter" is required' },
      { created_at: '"created_at" is required' },
    ]);
  });

  it("should return invalid values", async () => {
    const validate = new ShortenerValidate({
      url: "0000000000000000000000",
      alias: "0000000000000000000000",
      visitor_counter: "invalid",
      created_at: "invalid",
    });
    validate.validate();
    expect(validate.errors()).toStrictEqual([
      { url: '"url" must be a valid uri' },
      {
        alias:
          '"alias" length must be less than or equal to 15 characters long',
      },
      { visitor_counter: '"visitor_counter" must be a number' },
      { created_at: '"created_at" must be a valid date' },
    ]);
  });

  it("should return success without error", async () => {
    const validate = new ShortenerValidate({
      url: "http://gooogle.com",
      alias: "google",
      visitor_counter: 5,
      created_at: new Date(),
    });
    validate.validate();
    expect(validate.errors()).toBeNull();
  });
});
