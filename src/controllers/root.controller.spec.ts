import { expect, describe, it } from "@jest/globals";
import request from "supertest";

import app from "../app";

describe("GET /ping", () => {
    it("successfully ping server", async () => {
        const response = await request(app).get("/ping");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("env");
        expect(response.body.env).toBe("test");
        expect(response.body).toHaveProperty("timestamp");
        expect(response.body).toHaveProperty("timestamp_locale");
        expect(response.body).toHaveProperty("timezone");
        expect(response.body).toHaveProperty("app");
        expect(response.body.app).toHaveProperty("name");
        expect(response.body.app.name).toBe("ts-express");
        expect(response.body.app).toHaveProperty("version");
        expect(response.body.app.version).toMatch(/\d+\.\d+\.\d+/g);
    });
});
