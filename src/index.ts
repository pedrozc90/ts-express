import { Server } from "http";

import app from "./app";

const env: string = app.get("env");
const port: number = app.get("port");
const version: string = app.get("version");

/**
 * Start Express Server.
 */
const server: Server = app.listen(port);

server.on("listening", () => {
    if (!server.listening) return;

    const addr = server.address();

    console.log(addr);

    const bind = (addr) ? (typeof addr === "string" ? `Pipe ${addr}` : `http://${addr.address}:${addr.port}`) : null;

    console.log("----------------------------------------------------------------------");
    console.log(`Application running on ${bind}`);
    console.log("To shut it down, press CTRL + C at any time.");
    console.log("----------------------------------------------------------------------");
    console.log(`Process PID: ${process.pid}`);
    console.log(`Environment: ${env}`);
    console.log(`Version    : ${version}`);
    console.log("----------------------------------------------------------------------");
});

server.on("error", (error: Error | any) => {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind: string = (typeof port === "string") ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            // break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            // break;
        default:
            throw error;
    }
});

export default server;
