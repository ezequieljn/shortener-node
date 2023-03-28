import { CreateUrl } from "../shortener/application/use-cases/create-url.use-case";
import { HttpServer } from "../@seedwork/adapter/http.interface";
import { FindAlias } from "../shortener/application/use-cases/find-alias.use-case";
import { TopTen } from "../shortener/application/use-cases/top-ten.use-case";

export class ShortenerController {
  constructor(
    readonly httpServer: HttpServer,
    readonly createShortener: CreateUrl.UseCase,
    readonly findAliasShortener: FindAlias.UseCase,
    readonly topTenShortener: TopTen.UseCase
  ) {
    httpServer.on("post", "/", async (params: any, body: any) => {
      const start: any = new Date();
      const shortener = await createShortener.execute(body);
      const end: any = new Date();
      const elapsed = end - start;
      return {
        ...shortener,
        statistics: {
          time_taken: elapsed,
        },
      };
    });

    httpServer.redirect("get", "/:alias", async (params: any, body: any) => {
      const start: any = new Date();
      const shortener = await findAliasShortener.execute(params.alias);
      const end: any = new Date();
      const elapsed = end - start;
      return {
        ...shortener,
        statistics: {
          time_taken: elapsed,
        },
      };
    });

    httpServer.on("get", "/", async (params: any, body: any) => {
      const start: any = new Date();
      const shortener = await topTenShortener.execute();
      const end: any = new Date();
      const elapsed = end - start;
      return {
        shortener,
        statistics: {
          time_taken: elapsed,
        },
      };
    });
  }
}
