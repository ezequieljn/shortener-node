import * as dotenv from "dotenv";

export class Config {
  private constructor() {}

  static init() {
    dotenv.config();
    return new Config();
  }

  static database() {
    return {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    };
  }
}
