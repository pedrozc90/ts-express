import { NextFunction, Request, Response, Router } from "express";

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

export default router;
