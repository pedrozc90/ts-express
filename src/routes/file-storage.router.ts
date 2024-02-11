import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";

import { fileStorageRepository } from "../repositories";
import { FileStorage } from "../entities";
import db from "../data-source";

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
    const fs = FileStorage.create(request.file);
    const { content, ...serialize } = fs;
    return response.status(201).json(serialize);
});

const multer_middleware = upload.fields([
    { name: "ofx_file", maxCount: 1 },
    { name: "pdf_file", maxCount: 1 },
    { name: "csv_file", maxCount: 1 }
]);

router.post("/multiples", multer_middleware, async (request: Request, response: Response, next: NextFunction) => {
    const files = request.files as { [filename: string]: Express.Multer.File[] | undefined } | undefined;
    if (!files) {
        return response.status(400).json({ message: "Files not found." });
    }

    const ofx_file = (files["ofx_file"]?.length) ? files["ofx_file"][0] : null;
    if (!ofx_file) {
        return response.status(400).json({ message: "'ofx_file' not found." });
    }

    const pdf_file = (files["pdf_file"]?.length) ? files["pdf_file"][0] : null;
    if (!pdf_file) {
        return response.status(400).json({ message: "'pdf_file' not found." });
    }

    const csv_file = (files["csv_file"]?.length) ? files["csv_file"][0] : null;
    if (!csv_file) {
        return response.status(400).json({ message: "'csv_file' not found." });
    }

    const qr = db.createQueryRunner();

    await qr.connect();

    await qr.startTransaction();

    try {
        const ofx_obj = FileStorage.create(ofx_file);
        const ofx_fs = await qr.manager.save(FileStorage, ofx_obj);
        const { content: ofx_content, ...ofx_serialize } = ofx_fs;

        const pdf_obj = FileStorage.create(pdf_file);
        const pdf_fs = await qr.manager.save(FileStorage, pdf_obj);
        const { content: pdf_content, ...pdf_serialize } = pdf_fs;

        const csv_obj = FileStorage.create(csv_file);
        const csv_fs = await qr.manager.save(FileStorage, csv_obj);
        const { content: csv_content, ...csv_serialize } = csv_fs;
        
        await qr.commitTransaction();

        response.status(200).json({ result: [ ofx_serialize, pdf_serialize, csv_serialize ] });
    } catch (e) {
        await qr.rollbackTransaction();
        response.status(400).json({ message: 'Failed to save files.', stack_error: e });
    } finally {
        await qr.release();
    }
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
