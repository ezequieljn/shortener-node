import { CreateUrl } from "./shortener/application/use-cases/create-url.use-case";
import { ExpressAdapter } from "./@seedwork/adapter/express.adapter";
import { ShortenerController } from "./controller/shortener-controller";
import { FindAlias } from "./shortener/application/use-cases/find-alias.use-case";
import { Client } from "pg";
import { ShortenerPSQLRepository } from "./shortener/infra/db/psql/shortener.psql.repository";
import { Config } from "./config/config";
import { TopTen } from "./shortener/application/use-cases/top-ten.use-case";

import request from "supertest";
import assert from "assert";
import express from "express";
import { ShortenerInMemoryRepository } from "./shortener/infra/db/in-memory/shortener.in-memory.repository";

describe("Test e2e", () => {
  let httpServer: ExpressAdapter;

  function createServer() {
    httpServer = new ExpressAdapter();
    const repositoryInMemory = new ShortenerInMemoryRepository();

    const createShortenerUseCase = new CreateUrl.UseCase(repositoryInMemory);
    const findAliasShortenerUseCase = new FindAlias.UseCase(repositoryInMemory);
    const topTenShortenerUseCase = new TopTen.UseCase(repositoryInMemory);
    new ShortenerController(
      httpServer,
      createShortenerUseCase,
      findAliasShortenerUseCase,
      topTenShortenerUseCase
    );
  }

  it("should return error because the parameters are invalid", async () => {
    createServer();
    const res = await request(httpServer.app)
      .post("/")
      .expect("Content-Type", /json/);
    expect(res.body).toStrictEqual({
      ERR_CODE: 3,
      Description: [{ url: '"url" is required' }],
      statistics: { time_taken: expect.any(Number) },
    });
  });

  it("should create url with alias", async () => {
    createServer();
    const res = await request(httpServer.app)
      .post("/")
      .send({ url: "https://google.com", alias: "google" })
      .expect("Content-Type", /json/);
    expect(res.body).toStrictEqual({
      id: expect.any(String),
      url: "https://google.com",
      alias: "google",
      visitor_counter: 0,
      statistics: { time_taken: expect.any(Number) },
      created_at: expect.any(String),
    });
  });

  it("should not create two equal aliases, return err_code 1", async () => {
    createServer();
    await request(httpServer.app)
      .post("/")
      .send({ url: "https://google2.com", alias: "google" })
      .expect("Content-Type", /json/);
    const res = await request(httpServer.app)
      .post("/")
      .send({ url: "https://google.com", alias: "google" })
      .expect("Content-Type", /json/);
    expect(res.body).toStrictEqual({
      ERR_CODE: 1,
      Description: "CUSTOM ALIAS ALREADY EXISTS",
      statistics: {
        time_taken: expect.any(Number),
      },
    });
  });

  it("should return error when not found url", async () => {
    createServer();
    await request(httpServer.app)
      .post("/")
      .send({ url: "https://google2.com", alias: "google" })
      .expect("Content-Type", /json/);
    const res = await request(httpServer.app)
      .get("/teste")
      .expect("Content-Type", /json/);
    expect(res.body).toStrictEqual({
      ERR_CODE: 2,
      Description: "SHORTENED URL NOT FOUND",
      statistics: {
        time_taken: expect.any(Number),
      },
    });
  });

  it("should not return an error when it finds the alias", async () => {
    createServer();
    await request(httpServer.app)
      .post("/")
      .send({ url: "https://google2.com", alias: "google" })
      .expect("Content-Type", /json/);
    const res = await request(httpServer.app).get("/google");
    expect(res.status).not.toBe(400);
    expect(res.body).toStrictEqual({});
  });

  it("should list the top ten URLs", async () => {
    createServer();
    await request(httpServer.app)
      .post("/")
      .send({ url: "https://youtube.com", alias: "youtube" })
      .expect("Content-Type", /json/);
    await request(httpServer.app)
      .post("/")
      .send({ url: "https://google.com", alias: "google" })
      .expect("Content-Type", /json/);
    await request(httpServer.app).get("/google");
    await request(httpServer.app).get("/google");
    await request(httpServer.app)
      .post("/")
      .send({ url: "https://gmail.com", alias: "gmail" })
      .expect("Content-Type", /json/);
    await request(httpServer.app).get("/gmail");
    const res = await request(httpServer.app).get("/");
    expect(res.status).not.toBe(400);
    expect(res.body).toStrictEqual({
      shortener: [
        {
          alias: "google",
          created_at: expect.any(String),
          id: expect.any(String),
          url: "https://google.com",
          visitor_counter: 2,
        },
        {
          alias: "gmail",
          created_at: expect.any(String),
          id: expect.any(String),
          url: "https://gmail.com",
          visitor_counter: 1,
        },
        {
          alias: "youtube",
          created_at: expect.any(String),
          id: expect.any(String),
          url: "https://youtube.com",
          visitor_counter: 0,
        },
      ],
      statistics: {
        time_taken: expect.any(Number),
      },
    });
  });

  it("should return empty list when not finding url", async () => {
    createServer();
    const res = await request(httpServer.app).get("/");
    expect(res.status).not.toBe(400);
    expect(res.body).toStrictEqual({
      shortener: [],
      statistics: {
        time_taken: expect.any(Number),
      },
    });
  });
});
