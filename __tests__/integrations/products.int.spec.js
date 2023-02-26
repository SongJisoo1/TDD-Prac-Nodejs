const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const newProduct = require("../data/new-product.json");

let firstProduct = null;

beforeAll(done => {
    done();
});

afterAll(done => {
    mongoose.connection.close();
    done();
});

it("POST /api/products", async () => {
    const response = await request(app).post("/api/products").send(newProduct);

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newProduct.name);
    expect(response.body.description).toBe(newProduct.description);
});

it("shoult return 500 on POST /api/products", async () => {
    const response = await request(app)
        .post("/api/products")
        .send({ name: "test" });

    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
        errorMessage:
            "Product validation failed: description: Path `description` is required.",
    });
});

it("GET /api/products", async () => {
    const response = await request(app).get("/api/products");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    firstProduct = response.body[0];
    console.log(firstProduct);
});

it("GET /api/products/:productId", async () => {
    const response = await request(app).get(
        "/api/products/" + firstProduct._id,
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(firstProduct.name);
    expect(response.body.description).toBe(firstProduct.description);
});

it("GET id doesn't exist /api/products/:productId", async () => {
    const response = await request(app).get(
        "/api/products/63f9c2ce7528db699924c646",
    );
    expect(response.statusCode).toBe(404);
});

it("PATCH /api/products/:productId", async () => {
    const response = await request(app)
        .patch("/api/products/" + firstProduct._id)
        .send({ name: "updated name", description: "updated description" });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("updated name");
    expect(response.body.description).toBe("updated description");
});

it("should return 404 on PATCH /api/products/:productId", async () => {
    const response = await request(app)
        .patch("/api/products/" + "63f9c2ce7528db699924c649")
        .send({ name: "updated name", description: "updated description" });

    expect(response.statusCode).toBe(404);
});

it("DELETE /api/products/:productId", async () => {
    const response = await request(app)
        .delete("/api/products/" + firstProduct._id)
        .send();

    expect(response.statusCode).toBe(200);
});

it("should return 404 on DELETE /api/products/:productId", async () => {
    const response = await request(app)
        .delete("/api/products/" + firstProduct._id)
        .send();

    expect(response.statusCode).toBe(404);
});
