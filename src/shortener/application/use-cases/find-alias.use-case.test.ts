import { Shortener } from "../../domain/entities/shortener";
import { ShortenerInMemoryRepository } from "../../infra/db/in-memory/shortener.in-memory.repository";
import { FindAlias } from "./find-alias.use-case";

describe("Find URL - USE CASE", () => {
  let findUrlUseCase: FindAlias.UseCase;
  let repositoryShortener: ShortenerInMemoryRepository;

  beforeEach(() => {
    repositoryShortener = new ShortenerInMemoryRepository();
    findUrlUseCase = new FindAlias.UseCase(repositoryShortener);
  });

  it("should find alias url", async () => {
    repositoryShortener.create(
      new Shortener({
        alias: "google",
        url: "https://google.com",
      })
    );
    const findUrl: any = await findUrlUseCase.execute("google");
    expect(findUrl.alias).toBe("google");
    expect(findUrl.url).toBe("https://google.com");
    expect(findUrl.visitor_counter).toBe(1);
    expect(findUrl.created_at).toStrictEqual(expect.any(Date));
    expect(repositoryShortener.shorteners[0].visitor_counter).toBe(1);
  });

  it("should error code return because alias not found", async () => {
    const findUrl = await findUrlUseCase.execute("google");
    expect(findUrl).toStrictEqual({
      ERR_CODE: 2,
      Description: "SHORTENED URL NOT FOUND",
    });
  });
});
