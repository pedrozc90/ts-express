import { NextFunction, Request, Response, Router } from "express";
import { delay } from "../utils";

const router: Router = Router();

router.use((request: Request, response: Response, next: NextFunction) => {
    console.log("API Middleware", request.body, response.statusCode);
    next();
});

router.post("/login", (request: Request, response: Response, next: NextFunction) => {

    const username = request.body.username;
    if (!username) {
        return response.status(400).json({ message: "username is missing." });
    }
    
    const password = request.body.password;
    if (!password) {
        return response.status(400).json({ message: "password is missing." });
    }

    return response.status(200).json({ token: `${username}:${password}` });
});

router.put("/:n", (request: Request, response: Response, next: NextFunction) => {
    let n: number = parseInt(request.params.n, 10);

    if (isNaN(n)) {
        return response.status(400).json({ message: `param ${request.params.n} must be a number.` });
    } else if (n > 5_000_000_000) {
        n = 5_000_000_000;
    }

    let count = 0;
    for (let i = 0; i <= n; i++) {
        count += i;
    }

    response.json({ count });
});

router.get("/timeout/:ms", async (request: Request, response: Response, next: NextFunction) => {
    let ms: number = Number(request.params.ms) || 5000;
    await delay(ms);
    response.json({ message: "sanity check" });
});

export default router;
