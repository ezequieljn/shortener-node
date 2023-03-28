import { Shortener } from "../../domain/entities/shortener";
import { ShortenerRepositoryInterface } from "../../domain/repository/shortener.repository";

export namespace CreateUrl {
  export type Input = {
    url: string;
    alias: string;
  };

  export type Output =
    | {
        id: string;
        url: string;
        alias: string;
        visitor_counter: number;
        created_at: Date;
      }
    | { ERR_CODE: number; Description: string | any[] };

  export class UseCase {
    constructor(
      private readonly repositoryShortener: ShortenerRepositoryInterface
    ) {}

    async execute(input: Input): Promise<Output> {
      const shortener = new Shortener(input);
      if (shortener.validate()) {
        return { ERR_CODE: 3, Description: shortener.validate() };
      }
      const shortenerFound = await this.repositoryShortener.findByAlias(
        input.alias
      );
      if (shortenerFound) {
        return { ERR_CODE: 1, Description: "CUSTOM ALIAS ALREADY EXISTS" };
      }
      await this.repositoryShortener.create(shortener);
      return shortener.toJSON();
    }
  }
}
