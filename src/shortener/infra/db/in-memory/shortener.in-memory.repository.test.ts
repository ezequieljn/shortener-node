import { Shortener } from "../../../domain/entities/shortener";
import { ShortenerInMemoryRepository } from "./shortener.in-memory.repository";

describe("Shortener in memory repository", () => {
  let shortenerRepository: ShortenerInMemoryRepository;

  beforeEach(() => {
    shortenerRepository = new ShortenerInMemoryRepository();
  });

  it("should create shortener", async () => {
    const shortener = new Shortener({
      url: "https://google.com",
      alias: "google",
    });
    expect(shortenerRepository.shorteners).toStrictEqual([]);
    await shortenerRepository.create(shortener);
    expect(shortenerRepository.shorteners).toStrictEqual([shortener]);
  });

  it("should be able to find shortener", async () => {
    const shortener = new Shortener({
      url: "https://google.com",
      alias: "google",
    });
    shortenerRepository.shorteners = [shortener];
    const shortenerFind = await shortenerRepository.findById(
      shortener.uniqueId.id
    );
    expect(shortenerFind.alias).toBe("google");
    expect(shortenerFind.url).toBe("https://google.com");
  });

  it("should not be able to find", async () => {
    const shortener = new Shortener({
      url: "https://google.com",
      alias: "google",
    });
    shortenerRepository.shorteners = [shortener];
    const shortenerFind = await shortenerRepository.findById("id fake");
    expect(shortenerFind).toBeNull();
  });

  it("should be able to find alias shortener", async () => {
    const shortener = new Shortener({
      url: "https://google.com",
      alias: "google",
    });
    shortenerRepository.shorteners = [shortener];
    const shortenerFind = await shortenerRepository.findByAlias("google");
    expect(shortenerFind.alias).toBe("google");
    expect(shortenerFind.url).toBe("https://google.com");
  });

  it("should not be able to find alias", async () => {
    const shortener = new Shortener({
      url: "https://google.com",
      alias: "google",
    });
    shortenerRepository.shorteners = [shortener];
    const shortenerFind = await shortenerRepository.findByAlias("alias fake");
    expect(shortenerFind).toBeNull();
  });

  it("should return the 10 most accessed", async () => {
    const shorteners = new Array(15).fill(undefined).map(
      (_, i) =>
        new Shortener({
          url: `https://google${i}.com`,
          alias: `google${i}`,
          visitor_counter: i,
        })
    );
    shortenerRepository.shorteners = shorteners;
    expect(shortenerRepository.shorteners).toHaveLength(15);
    const topTen = await shortenerRepository.listTopTen();
    expect(topTen).toHaveLength(10);
    topTen.forEach((shortener, i) => {
      const indexInvert = 14 - i;
      expect(shortener.url).toBe(`https://google${indexInvert}.com`);
      expect(shortener.alias).toBe(`google${indexInvert}`);
    });
  });
});
