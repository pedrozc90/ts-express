import { rejects } from "assert";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret, VerifyErrors } from "jsonwebtoken";

const BEARER_REGEXP = new RegExp(/(?:Bearer)\s*(.+?)/i);

export function authenticated(request: Request, response: Response, next: NextFunction) {
    const header: string | undefined = request.header("Authorization");
    if (!header) {
        return response.status(401).json({ message: "Authorization header not found." });
    }

    const matcher = BEARER_REGEXP.exec(header);
    if (!matcher) {
        return response.status(401).json({ message: "Invalid Bearer." });
    }

    const token: string = matcher[1];

    const decoded: JwtPayload | string = jwt.verify(token, process.env.JWT_SECRET as Secret);
    console.log(decoded);

    response.locals.decoded = decoded;

    next();
}
