import { Shortener } from "../entities/shortener";

export interface ShortenerRepositoryInterface {
  create(shortener: Shortener): Promise<void>;
  increaseVisits(id: string): Promise<void>;
  findById(id: string): Promise<Shortener | null>;
  findByAlias(alias: string): Promise<Shortener | null>;
  listTopTen(): Promise<Shortener[]>;
}
