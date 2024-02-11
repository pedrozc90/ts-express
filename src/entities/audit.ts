import { CreateDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";

export class Audit {

    @CreateDateColumn({ name: "inserted_at", type: "timestamp with time zone", nullable: false, default: () => "CURRENT_TIMESTAMP" })
    public insertedAt!: Date;

    @UpdateDateColumn({ name: "updated_at", type: "timestamp with time zone", nullable: false, default: () => "CURRENT_TIMESTAMP" })
    public updatedAt!: Date;

    @VersionColumn({ name: "version", type: "integer", default: 0, nullable: false })
    public version: number = 0; 
    
}
