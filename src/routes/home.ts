import { NextFunction, Request, Response, Router } from "express";

const router: Router = Router();

router.get("/", (request: Request, response: Response, next: NextFunction) => {
    return response.json({ message: "sanity check" });
});

router.get("/ping", (request: Request, response: Response, next: NextFunction) => {
    const env: string = request.app.get("env");
    const name: string = request.app.get("name");
    const version: string = request.app.get("version");
    const timestamp = new Date().toISOString();
    return response.json({
        env,
        timestamp,
        app: {
            name,
            version
        }
    });
});

export default router;
