import { Shortener } from "../../domain/entities/shortener";
import { ShortenerRepositoryInterface } from "../../domain/repository/shortener.repository";

export namespace FindAlias {
  export type Input = string;

  type ShortenerProps = {
    id: string;
    url: string;
    alias: string;
    visitor_counter: number;
    created_at: Date;
  };

  export type Output =
    | { ERR_CODE: number; Description: string }
    | ShortenerProps;

  export class UseCase {
    constructor(
      private readonly repositoryShortener: ShortenerRepositoryInterface
    ) {}

    async execute(input: Input): Promise<Output> {
      const shortener = await this.repositoryShortener.findByAlias(input);
      if (!shortener) {
        return { ERR_CODE: 2, Description: "SHORTENED URL NOT FOUND" };
      }
      await this.repositoryShortener.increaseVisits(shortener.uniqueId.id);
      return shortener.toJSON();
    }
  }
}
