import { DataSource } from "typeorm";
import "reflect-metadata";

const db = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "pedrozc90",
    synchronize: false,
    logging: false,
    entities: [ "src/entities/**/*.ts" ],
    subscribers: [],
    // migrations
    migrations: [
        "src/migrations/*.ts",
        "src/migrations/*.sql"
    ],
    migrationsRun: true,
    useUTC: true
});

export default db;
