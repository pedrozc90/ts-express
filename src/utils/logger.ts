import winston from "winston";
import { TransformableInfo } from "logform";

// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
const formatter = (info: TransformableInfo) => {
    const { timestamp, level, message, ...args } = info;
    const ts = (timestamp as string).replace("T", " " ).replace("Z", "");
    const metadata = Object.keys(args).length ? JSON.stringify(args, null, '') : ''
    return `${ ts } ${ level } [${ process.pid }] ${ message } ${ metadata }`;
};

// Define the Winston logger configuration
const logger = winston.createLogger({
    silent: (process.env.NODE_ENV === "test"),
    level: "info",
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        // winston.format.prettyPrint()
        winston.format.printf(formatter)
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "logs/application.log" })
    ]
});

export default logger;  
