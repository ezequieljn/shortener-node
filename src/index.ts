import { CreateUrl } from "./shortener/application/use-cases/create-url.use-case";
import { ExpressAdapter } from "./@seedwork/adapter/express.adapter";
import { ShortenerController } from "./controller/shortener-controller";
import { FindAlias } from "./shortener/application/use-cases/find-alias.use-case";
import { Client } from "pg";
import { ShortenerPSQLRepository } from "./shortener/infra/db/psql/shortener.psql.repository";
import { Config } from "./config/config";
import { TopTen } from "./shortener/application/use-cases/top-ten.use-case";

const httpServer = new ExpressAdapter();

Config.init();

const client = new Client(Config.database());

client.connect();

const repositoryShortener = new ShortenerPSQLRepository(client);
const createShortenerUseCase = new CreateUrl.UseCase(repositoryShortener);
const findAliasShortenerUseCase = new FindAlias.UseCase(repositoryShortener);
const topTenShortenerUseCase = new TopTen.UseCase(repositoryShortener);
new ShortenerController(
  httpServer,
  createShortenerUseCase,
  findAliasShortenerUseCase,
  topTenShortenerUseCase
);

httpServer.listen(3030);
