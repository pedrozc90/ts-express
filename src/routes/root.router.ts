import { Router } from "express";
import { badRequest, index, ping } from "../controllers/root.controller";

const router: Router = Router();

router.get("/", index);
router.get("/ping", ping);
router.get("/bad", badRequest);

export default router;
