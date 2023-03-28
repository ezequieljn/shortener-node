import { Shortener } from "../../domain/entities/shortener";
import { ShortenerRepositoryInterface } from "../../domain/repository/shortener.repository";

export namespace TopTen {
  type ShortenerProps = {
    id: string;
    url: string;
    alias: string;
    visitor_counter: number;
    created_at: Date;
  };
  export type Output = ShortenerProps[];
  export class UseCase {
    constructor(
      private readonly repositoryShortener: ShortenerRepositoryInterface
    ) {}
    async execute(): Promise<Output> {
      const shorteners = await this.repositoryShortener.listTopTen();
      return shorteners.map((s) => s.toJSON());
    }
  }
}
