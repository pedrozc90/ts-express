import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm"
import crypto from "crypto";
import path from "path";

import { Audit } from "./audit";

@Entity({ name: "file_storage" })
export class FileStorage {

    @PrimaryGeneratedColumn("increment" , { type: "bigint", name: "id" })
    public id: number | null = null;

    @Column(() => Audit, { prefix: false })
    public audit!: Audit;

    @Column({ name: "hash", type: "varchar", length: 64, nullable: false })
    public hash!: string;

    @Column({ name: "filename", type: "varchar", nullable: false })
    public filename!: string;

    @Column({ name: "extension", type: "varchar", length: 8, nullable: false })
    public extension!: string;

    @Column({ name: "content", type: "bytea", nullable: false })
    public content!: Buffer;

    @Column({ name: "content_type", type: "varchar", length: 64, nullable: false })
    public contentType!: string;

    @Column({ name: "length", nullable: false })
    public length: number = 0;

    @BeforeInsert()
    public onBeforeInsert(): void {
        if (this.filename) {
            this.extension = path.extname(this.filename).substring(1);
        }
        if (this.content) {
            const hash = crypto.createHash("shake256");
            hash.update(this.content);
            this.hash = hash.digest("hex");
        }
    }

    public static create(file: Express.Multer.File): FileStorage {
        const fs = new FileStorage();
        fs.filename = file.originalname;
        fs.contentType = file.mimetype
        fs.length = file.size;
        fs.content = file.buffer;
        return fs;
    }

}
