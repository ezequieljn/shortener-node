import { Shortener } from "../../domain/entities/shortener";
import { ShortenerInMemoryRepository } from "../../infra/db/in-memory/shortener.in-memory.repository";
import { TopTen } from "./top-ten.use-case";

describe("Top Ten URL - USE CASE", () => {
  let topTenUseCase: TopTen.UseCase;
  let repositoryShortener: ShortenerInMemoryRepository;

  beforeEach(() => {
    repositoryShortener = new ShortenerInMemoryRepository();
    topTenUseCase = new TopTen.UseCase(repositoryShortener);
  });

  it("should return sorted visitor_counter", async () => {
    repositoryShortener.shorteners = [
      new Shortener({
        alias: "google4",
        url: "https://google.com",
        visitor_counter: 4,
      }),
      new Shortener({
        alias: "google7",
        url: "https://google.com",
        visitor_counter: 7,
      }),
      new Shortener({
        alias: "google3",
        url: "https://google.com",
        visitor_counter: 3,
      }),
    ];

    const topTen: any = await topTenUseCase.execute();
    expect(topTen[0].alias).toBe("google7");
    expect(topTen[0].visitor_counter).toBe(7);
    expect(topTen[1].alias).toBe("google4");
    expect(topTen[1].visitor_counter).toBe(4);
    expect(topTen[2].alias).toBe("google3");
    expect(topTen[2].visitor_counter).toBe(3);
  });

  it("should return empty array", async () => {
    const topTen: any = await topTenUseCase.execute();
    expect(topTen).toStrictEqual([]);
  });
});
