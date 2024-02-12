import { expect, describe, it } from "vitest";
import request from "supertest";

import app from "../app";

describe("GET /ping", () => {
    it("successfully ping server", async () => {
        const response = await request(app).get("/ping");

        expect(response.status).toBe(200);
        expect(response.body).have.property("env");
        expect(response.body).have.property("timestamp");
        expect(response.body).have.property("timestamp_locale");
        expect(response.body).have.property("timezone");
        expect(response.body).have.property("app");
        expect(response.body.app).have.property("name");
        expect(response.body.app).have.property("version");
    });
});
