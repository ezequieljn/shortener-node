import { ShortenerInMemoryRepository } from "../../infra/db/in-memory/shortener.in-memory.repository";
import { CreateUrl } from "./create-url.use-case";

describe("Create URL - USE CASE", () => {
  let createUrlUseCase: CreateUrl.UseCase;
  let repositoryShortener: ShortenerInMemoryRepository;

  beforeEach(() => {
    repositoryShortener = new ShortenerInMemoryRepository();
    createUrlUseCase = new CreateUrl.UseCase(repositoryShortener);
  });

  it("should create url", async () => {
    await createUrlUseCase.execute({
      alias: "google",
      url: "https://google.com",
    });
    expect(repositoryShortener.shorteners[0].alias).toBe("google");
    expect(repositoryShortener.shorteners[0].url).toBe("https://google.com");
    expect(repositoryShortener.shorteners[0].visitor_counter).toBe(0);
    expect(repositoryShortener.shorteners[0].created_at).toStrictEqual(
      expect.any(Date)
    );
  });

  it("should return params invalid", async () => {
    const createUrl = await createUrlUseCase.execute({
      alias: "google",
      url: "google",
    });
    expect(createUrl).toStrictEqual({
      ERR_CODE: 3,
      Description: [{ url: '"url" must be a valid uri' }],
    });
  });

  it("should not create url because alias exist", async () => {
    await createUrlUseCase.execute({
      alias: "google",
      url: "https://google.com",
    });
    const createUrl = await createUrlUseCase.execute({
      alias: "google",
      url: "https://google.com",
    });
    expect(createUrl).toStrictEqual({
      ERR_CODE: 1,
      Description: "CUSTOM ALIAS ALREADY EXISTS",
    });
  });
});
