import { Shortener } from "../../../domain/entities/shortener";
import { ShortenerRepositoryInterface } from "../../../domain/repository/shortener.repository";
import { Client } from "pg";
import { UniqueEntityId } from "../../../../@seedwork/domain/vo/unique-entity-id.vo";

export class ShortenerPSQLRepository implements ShortenerRepositoryInterface {
  constructor(private pg: Client) {}
  shorteners: any[] = [];
  async create(shortener: Shortener): Promise<void> {
    this.pg.query(
      "insert into shortener (url, alias, visitor_counter, created_at) VALUES ($1, $2, $3, $4)",
      [
        shortener.url,
        shortener.alias,
        shortener.visitor_counter,
        shortener.created_at,
      ]
    );
  }
  async increaseVisits(id: string): Promise<void> {
    const query = {
      text: "UPDATE shortener SET visitor_counter = visitor_counter + 1 WHERE id = $1;",
      values: [id],
    };
    await this.pg.query(query);
  }
  async findById(id: string): Promise<Shortener> {
    const query = {
      text: "SELECT * FROM shortener WHERE id = $1",
      values: [id],
    };
    const res = await this.pg.query(query);
    const row: any = res.rows[0];
    return new Shortener(row, new UniqueEntityId(row.id));
  }
  async findByAlias(alias: string): Promise<Shortener> {
    const query = {
      text: "SELECT * FROM shortener WHERE alias = $1",
      values: [alias],
    };
    const res = await this.pg.query(query);
    const row: any = res.rows[0];
    if (row) {
      return new Shortener(row, new UniqueEntityId(row.id));
    }
    return null;
  }
  async listTopTen(): Promise<Shortener[]> {
    const query = {
      text: "SELECT * FROM shortener ORDER BY visitor_counter DESC LIMIT 10;",
    };
    const res = await this.pg.query(query);
    const rows = res.rows;
    return rows.map((r) => new Shortener(r, new UniqueEntityId(r.id)));
  }
}
