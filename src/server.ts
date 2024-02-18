import http from "http";

import app from "./app";
import logger from "./utils/logger";

export const DI = {} as {
    server: http.Server;
};

const env = app.get("env");
const port = app.get("port");
const version = app.get("version");

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
