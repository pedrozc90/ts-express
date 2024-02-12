import http from "http";
import path from "path";

import express, { Application, NextFunction, Request, Response } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import methodOverride from "method-override";

import logger from "./utils/logger";
import settings from "./settings";
import RootRouter from "./routes/root.router";
import FileStorageRouter from "./routes/file-storage.router";

export const DI = {} as {
    server: http.Server;
};

// create express server
export const app: Application = express();
const env = settings.env
const port = settings.http.port;
const version = settings.version

export const init = async () => {
    // ------------------------------------------------------------
    // APPLICATION
    // ------------------------------------------------------------
    // application settings
    app.set("name", settings.name);
    app.set("version", version);
    app.set("env", env);
    app.set("port", port);

    // setup static files
    app.use("/static", express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));

    // view engine
    // app.set("views", path.join(__dirname, "views"));
    // app.set("view engine", "pug");

    // gzip compression
    app.use(compression());

    // body parser params and attach them to req.body
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // lets you use HTTP verbs such as PUT or DELETE
    // in places where the client doesn't support it
    app.use(methodOverride());

    // secure apps by setting various HTTP headers
    app.use(helmet());

    // enable CORS (Corss Origin Resource Sharing)
    app.use(cors());

    // middlewares
    app.use((request: Request, response: Response, next: NextFunction) => {
        response.locals.settings = settings;
        next();
    });

    // logger
    app.use((request: Request, response: Response, next: NextFunction) => {
        logger.info(`${ request.method } ${ request.url }`, { body: request.body, params: request.params })
        next();
    });

    // API Routes
    app.use("/", RootRouter);
    app.use("/api/fs", FileStorageRouter);
    app.use("*", (request: Request, response: Response) => {
        return response.status(404).json({ message: "page not found." });
    });

    // error handler
    app.use((error: any, request: Request, response: Response, next: NextFunction) => {
        const status_code = error.status_code || 500;
        const message = error.message;
        const stack_error = error.stack;
        response.status(status_code).json({ message, stack_error});
    });

    // ------------------------------------------------------------
    // SERVER
    // ------------------------------------------------------------
    const server: http.Server = app.listen(port);

    server.on("listening", () => {
        if (!server.listening) return;
    
        const addr = server.address();
    
        logger.info("Address:", addr);
    
        const bind = (addr) ? (typeof addr === "string" ? `Pipe ${addr}` : `http://${addr.address}:${addr.port}`) : null;
    
        logger.info("----------------------------------------------------------------------");
        logger.info(`Application running on ${bind}`);
        logger.info("To shut it down, press CTRL + C at any time.");
        logger.info("----------------------------------------------------------------------");
        logger.info(`Process PID: ${process.pid}`);
        logger.info(`Environment: ${env}`);
        logger.info(`Version    : ${version}`);
        logger.info("----------------------------------------------------------------------");
    });
    
    server.on("error", (error: Error | any) => {
        if (error.syscall !== "listen") {
            throw error;
        }
    
        const bind: string = (typeof port === "string") ? "Pipe " + port : "Port " + port;
    
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case "EACCES":
                logger.error(bind + " requires elevated privileges");
                process.exit(1);
                // break;
            case "EADDRINUSE":
                logger.error(bind + " is already in use");
                process.exit(1);
                // break;
            default:
                throw error;
        }
    });

    DI.server = server;
}

init();
