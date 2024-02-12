import { NextFunction, Request, Response } from "express";
import { HttpStatus, IPing } from "../types";

export const index = (request: Request, response: Response, next: NextFunction) => {
    response.redirect("ping");
}

export const ping = (request: Request, response: Response, next: NextFunction) => {
    const env: string = request.app.get("env");
    const name: string = request.app.get("name");
    const version: string = request.app.get("version");
    const timestamp = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const formatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
        hour12: false,
        timeZone: timezone
    });

    const parts = formatter.formatToParts(timestamp);

    const result: IPing = {
        env,
        timestamp,
        timestamp_locale: `${parts[4].value}-${parts[2].value}-${parts[0].value}T${parts[6].value}:${parts[8].value}:${parts[10].value}.${parts[12].value}`,
        timezone,
        app: {
            name,
            version
        }
    }
    response.status(HttpStatus.OK).json(result);
}

export const badRequest = (request: Request, response: Response, next: NextFunction) => {
    throw new Error("Method Not Implemented.");
}
