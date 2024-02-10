import { FileStorage } from "../entities";
import { BaseRepository } from "./base.repository";

export class FileStorageRepository extends BaseRepository<FileStorage> {

    private static readonly instance = new FileStorageRepository();

    private readonly select: any[] = [
        "id",
        "audit.insertedAt",
        "audit.updatedAt",
        "audit.version",
        // "audit",             // just "audit" do not load its columns, for some reason.
        "hash",
        "filename",
        "extension",
        "contentType",
        "length"
    ];

    constructor() {
        super(FileStorage);
    }

    public static getInstance(): FileStorageRepository {
        return this.instance;
    }

    public async create(file: Express.Multer.File): Promise<FileStorage> {
        const fs = new FileStorage();
        fs.filename = file.originalname;
        fs.contentType = file.mimetype
        fs.length = file.size;
        fs.content = file.buffer;
        return fileStorageRepository.insert(fs);
    }

    public async getById(id: number): Promise<FileStorage | null> {
        return this.repo.findOne({
            where: { id },
            select: this.select
        });
    }

    public async getContent(id: number): Promise<Buffer | null> {
        return this.repo.createQueryBuilder("fs")
            .where("fs.id = :id", { id })
            .select("fs.content", "content")
            .getRawOne()
            .then((res) => res.content || null);
    }

    public async findMany(): Promise<FileStorage[]> {
        return this.repo.find({
            select: this.select
        });
    }

}

export const fileStorageRepository = FileStorageRepository.getInstance();
