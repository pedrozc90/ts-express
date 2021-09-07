import os from "os";
import cluster, { Worker } from "cluster";
import express, { Application, Request, Response, NextFunction } from "express";

import compression from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import helmet from "helmet";
import cors from "cors";
import { Server } from "http";

const CORES: number = os.cpus().length;

const PORT: number = Number(process.env.PORT) || 3000;
let CONCURRENCY: number =  Number(process.env.CONCURRENCY) || 1;

if (CONCURRENCY > CORES) {
    CONCURRENCY = CORES;
}

console.log("CONCURRENCY", CONCURRENCY);

if (cluster.isMaster) {
    console.log(`Number of Cores: ${CORES}`);
    console.log(`Master ${process.pid} is running.`);

    // fork workers
    for (let i = 0; i < CONCURRENCY; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker: Worker, code: number, signal: string) => {
        console.log(`Worker ${worker.process.pid} died. Forking a new worker.`);
        cluster.fork();
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    const app: Application = express();

    app.use(compression())
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use(cookieParser())
        .use(methodOverride())
        .use(helmet())
        .use(cors());

    app.get("/", (request: Request, response: Response) => {
        response.json({ message: "sanity check" });
    });

    app.get("/api/:n", (request: Request, response: Response) => {
        const init: number = Date.now();

        let n = parseInt(request.params.n, 10);
        if (isNaN(n)) {
            return response
                .status(400)
                .json({
                    message: `Param ${request.params.n} must be a number.`,
                });
        } else if (n > 5_000_000_000) {
            n = 5_000_000_00;
            0;
        }

        let count: number = 0;
        for (let i = 0; i <= n; i++) {
            count += i;
        }

        const elapsed: number = Date.now() - init;

        console.log(request.url, request.params, { count, elapsed });

        return response.json({ count });
    });

    const server: Server = app.listen(PORT, () => {
        console.log(`Application is listening on port ${PORT}.`);
    });

    console.log(`Worker ${process.pid} started`);
}
