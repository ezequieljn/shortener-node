import { Shortener } from "shortener/domain/entities/shortener";
import { ShortenerRepositoryInterface } from "shortener/domain/repository/shortener.repository";

export class ShortenerInMemoryRepository
  implements ShortenerRepositoryInterface
{
  shorteners: Shortener[] = [];

  async create(shortener: Shortener): Promise<void> {
    this.shorteners.push(shortener);
  }

  async increaseVisits(id: string): Promise<void> {
    this.shorteners =
      this.shorteners.map((s) => {
        if (s.uniqueId.id === id) {
          s.increase_visit();
        }
        return s;
      }) || null;
  }

  async findById(id: string): Promise<Shortener> {
    return this.shorteners.find((s) => s.uniqueId.id === id) || null;
  }

  async findByAlias(alias: string): Promise<Shortener> {
    return this.shorteners.find((s) => s.alias === alias) || null;
  }

  async listTopTen(): Promise<Shortener[]> {
    const topTen: Shortener[] = Object.assign(this.shorteners);
    topTen.sort((a, b) => b.visitor_counter - a.visitor_counter);

    return topTen.slice(0, 10);
  }
}
