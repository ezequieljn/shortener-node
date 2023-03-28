import express from "express";
import { HttpServer } from "./http.interface";

export class ExpressAdapter implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());

    this.app.use(function (req: any, res: any, next: any) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      next();
    });
  }

  on(method: string, url: string, callback: Function): void {
    this.app[method](url, async function (req: any, res: any) {
      const output = await callback(req.params, req.body);
      res.status(output.ERR_CODE ? 400 : 200).json(output);
    });
  }

  redirect(method: string, url: string, callback: Function): void {
    this.app[method](url, async function (req: any, res: any) {
      const output = await callback(req.params, req.body);
      if (output.ERR_CODE) {
        return res.status(400).json(output);
      }
      return res.redirect(output.url);
    });
  }

  listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`start server: ${port}`);
    });
  }
}
