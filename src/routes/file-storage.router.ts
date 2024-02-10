import { Express, NextFunction, Request, Response, Router } from "express";
import multer, { Multer } from "multer";

import { fileStorageRepository } from "../repositories";
import { FileStorage } from "../entities";

const storage = multer.memoryStorage();
const upload = multer({ dest: "./tmp", storage });

const router: Router = Router();

router.get("/", async (request: Request, response: Response, next: NextFunction) => {
    const files = await fileStorageRepository.findMany();
    console.log(files);
    return response.status(200).json({ files });
});

router.post("/", upload.single("file"), async (request: Request, response: Response, next: NextFunction) => {
    if (!request.file) {
        return response.status(400).json({ message: "file not found." });
    }
    const fs = await fileStorageRepository.create(request.file);
    const { content, ...serialize } = fs;
    return response.status(201).json(serialize);
});

const multer_middleware = upload.fields([
    { name: "ofx_file", maxCount: 1 },
    { name: "pdf_file", maxCount: 1 },
    { name: "csv_file", maxCount: 1 }
]);

router.post("/multiples", multer_middleware, async (request: Request, response: Response, next: NextFunction) => {
    const files = request.files;
    if (!files) {
        return response.status(400).json({ message: "Files not found." });
    }

    const result = [];

    const ofx_files = (files as any)["ofx_file"];
    if (ofx_files?.length) {
        const ofx_file = ofx_files[0];
        const ofx_fs = await fileStorageRepository.create(ofx_file);
        const { content, ...serialize } = ofx_fs;
        result.push(serialize);
    }

    const pdf_files = (files as any)["pdf_file"];
    if (pdf_files?.length) {
        const pdf_file = pdf_files[0];
        const pdf_fs = await fileStorageRepository.create(pdf_file);
        const { content, ...serialize } = pdf_fs;
        result.push(serialize);
    }

    const csv_files = (files as any)["csv_file"];
    if (csv_files?.length) {
        const csv_file = csv_files[0];
        const csv_fs = await fileStorageRepository.create(csv_file);
        const { content, ...serialize } = csv_fs;
        result.push(serialize);
    }
    return response.status(200).json({ result });
});

router.get("/:id", async (request: Request, response: Response, next: NextFunction) => {
    const id = Number(request.params.id);
    const fs = await fileStorageRepository.getById(id);
    return response.status(200).json(fs);
});

router.get("/:id/view", async (request: Request, response: Response, next: NextFunction) => {
    const id = Number(request.params.id);
    const fs = await fileStorageRepository.getById(id);
    if (!fs) {
        return response.status(404).json({ message: "File not found." });
    }
    const content = await fileStorageRepository.getContent(id);
    return response
        .status(200)
        .type(fs.contentType)
        .send(content);
});

export default router;
