import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import methodOverride from "method-override";
import morgan from "morgan";

import settings from "./settings";
import RootRouter from "./routes/root.router";
import FileStorageRouter from "./routes/file-storage.router";

// create express server
const app: Application = express();

// if (settings.env === "development") {
//     app.use(morgan("development"));
// }

// application settings
app.set("name", settings.name);
app.set("version", settings.version);
app.set("env", settings.env);
app.set("port", settings.http.port);

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

export default app;
