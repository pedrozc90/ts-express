import { expect, describe, it } from "@jest/globals";
import request from "supertest";
import fs from "fs";

import app from "../app";

describe("POST /api/fs", () => {
    it("read test file", () => {
        const file = fs.readFileSync("docs/test.txt");
        expect(file).not.toBeNull();
        expect(file).toBeInstanceOf(Buffer);
    });

    it("successfully upload file 'test.txt'", async () => {
        const response = await request(app).post("/api/fs").attach("file", "docs/test.txt");
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("filename", "test.txt");
        expect(response.body).toHaveProperty("extension", "txt");
        expect(response.body).toHaveProperty("content_type", "text/plain");
        expect(response.body).toHaveProperty("size");
        expect(response.body.size).toBeGreaterThan(0);
        expect(response.body).toHaveProperty("content");
        expect(response.body.content).toHaveProperty("type", "Buffer");
        expect(response.body.content).toHaveProperty("data");
        expect(response.body.content.data).toBeInstanceOf(Array);
    });
});
