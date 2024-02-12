import fs from "fs";
import { expect, describe, it } from "vitest";
import request from "supertest";

import { app } from "../server";

describe("POST /api/fs", () => {
    it("read test file", () => {
        const file = fs.readFileSync("docs/test.txt");
        expect(file).not.toBeNull();
        expect(file).toBeInstanceOf(Buffer);
    });

    it("successfully upload file 'test.txt'", async () => {
        const response = await request(app).post("/api/fs")
            .attach("file", "docs/test.txt");

        expect(response.status).toBe(201);
        expect(response.body).have.property("filename");
        expect(response.body).have.property("extension");
        expect(response.body).have.property("content_type");
        expect(response.body).have.property("size");
        expect(response.body).have.property("content");
        expect(response.body.content).have.property("type", "Buffer");
        expect(response.body.content).have.property("data");
    });
});
