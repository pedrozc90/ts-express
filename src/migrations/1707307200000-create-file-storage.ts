import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFileStorage1707307200000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE SEQUENCE IF NOT EXISTS public.file_storage_id_seq AS bigint
            INCREMENT BY 1
            START WITH 1
            MINVALUE 1
            CACHE 1;
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS file_storage (
                id              BIGINT                               DEFAULT nextval('public.file_storage_id_seq'),
                
                inserted_at     TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT current_timestamp,
                updated_at      TIMESTAMP WITH TIME ZONE    NOT NULL DEFAULT current_timestamp,
                version         INTEGER                     NOT NULL DEFAULT 0,
                
                "hash"          VARCHAR(64)                 NOT NULL,
                filename        VARCHAR(255)                NOT NULL,
                extension       VARCHAR(8)                  NOT NULL,
                content         BYTEA                       NOT NULL,
                content_type    VARCHAR(64)                 NOT NULL,
                "length"        INTEGER                     NOT NULL DEFAULT 0,
            
                CONSTRAINT file_storage_pkey PRIMARY KEY (id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
