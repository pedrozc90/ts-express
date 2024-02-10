import { DataSource, EntityTarget, ObjectLiteral } from "typeorm";
import db from "../data-source";

export class BaseRepository<T extends ObjectLiteral> {

    // protected readonly dataSource: DataSource = db;
    protected readonly repo;

    constructor(protected readonly clazz: EntityTarget<T>) {
        this.repo = db.getRepository(clazz);
    }

    public async insert(value: any): Promise<T> {
        const obj = db.manager.create(this.clazz, value);
        return this.repo.save(obj);
    }

    public async findMany(): Promise<T[]> {
        return this.repo.find();
    }
    
}
