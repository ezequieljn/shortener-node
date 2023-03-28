import { Shortener, ShortenerProperties } from "./shortener";

describe("Shortener Unit Tests", () => {
  test("constructor of shortener", () => {
    let shortener = new Shortener({
      url: "https://google.com",
      alias: "google",
    });
    expect(shortener.url).toBe("https://google.com");
    expect(shortener.alias).toBe("google");
    expect(shortener.visitor_counter).toBe(0);
    expect(shortener.created_at).toStrictEqual(expect.any(Date));
  });

  test("increase visit of entity", () => {
    let shortener = new Shortener({
      url: "https://google.com",
      alias: "google",
    });

    expect(shortener.visitor_counter).toBe(0);
    shortener.increase_visit();
    expect(shortener.visitor_counter).toBe(1);
  });
});
