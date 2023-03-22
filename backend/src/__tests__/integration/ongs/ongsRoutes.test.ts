import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { mockedDeleteOng, mockedOng, mockedOngLogin } from "../../mocks";

describe("/ong", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /ong -  Must be able to create an ONG", async () => {
    const response = await request(app).post("/ong").send(mockedOng);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("companyName");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("github");
    expect(response.body).toHaveProperty("linkedin");
    expect(response.body).toHaveProperty("profilePicture");
    expect(response.body).toHaveProperty("cnpj");
    expect(response.body).toHaveProperty("isActive");
    expect(response.body).toHaveProperty("phone");
    expect(response.body).toHaveProperty("ownerName");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body).not.toHaveProperty("password");
    expect(response.body.companyName).toEqual("ABCDE");
    expect(response.body.email).toEqual("abcde@email.com");
    expect(response.body.isActive).toEqual(true);
    expect(response.status).toEqual(201);
  });

  test("POST /ong -  should not be able to create an ONG that already exists", async () => {
    const response = await request(app).post("/ong").send(mockedOng);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(409);
  });

  test("GET /ong -  Must be able to list ONGs", async () => {
    const {
      body: { token },
    } = await request(app).post("/login").send(mockedOngLogin);
    const response = await request(app)
      .get("/ong")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("companyName");
    expect(response.body[0]).toHaveProperty("email");
    expect(response.body[0]).toHaveProperty("github");
    expect(response.body[0]).toHaveProperty("linkedin");
    expect(response.body[0]).toHaveProperty("profilePicture");
    expect(response.body[0]).toHaveProperty("cnpj");
    expect(response.body[0]).toHaveProperty("phone");
    expect(response.body[0]).toHaveProperty("ownerName");
    expect(response.body[0]).toHaveProperty("createdAt");
    expect(response.body[0]).toHaveProperty("updatedAt");
    expect(response.body[0]).not.toHaveProperty("password");
    expect(response.body[0].companyName).toEqual("ABCDE");
    expect(response.body[0].email).toEqual("abcde@email.com");
    expect(response.status).toEqual(200);
  });

  test("GET /ong -  should not be able to list ONGs without authentication", async () => {
    const response = await request(app).get("/ong");

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("DELETE /ong -  Must be able to delete an ONG", async () => {
    const {
      body: { token },
    } = await request(app).post("/login").send(mockedOngLogin);
    const { body: ong } = await request(app).post("/ong").send(mockedDeleteOng);
    const response = await request(app)
      .delete(`/ong/${ong.id}`)
      .set("Authorization", `Bearer ${token}`);

    mockedDeleteOng.id = ong.id;

    expect(response.status).toEqual(204);
  });

  test("DELETE /ong/:id -  shouldn't be able to delete ONG with isActive = false", async () => {
    await request(app).post("/ong").send(mockedDeleteOng);

    const {
      body: { token },
    } = await request(app).post("/login").send(mockedOngLogin);

    const response = await request(app)
      .delete(`/ong/${mockedDeleteOng.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(400);
  });

  test("DELETE /ong/:id -  should not be able to delete ONG without authentication", async () => {
    const loginResponse = await request(app)
      .post("/login")
      .send(mockedDeleteOng);
    const ongTobeDeleted = await request(app)
      .get("/ong")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    const response = await request(app).delete(
      `/users/${ongTobeDeleted.body[0].id}`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("DELETE /ong/:id -  should not be able to delete ONG with invalid id", async () => {
    await request(app).post("/ong").send(mockedDeleteOng);

    const adminLoginResponse = await request(app)
      .post("/login")
      .send(mockedOngLogin);

    const response = await request(app)
      .delete(`/ong/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", `Bearer ${adminLoginResponse.body.token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  test("PATCH /ong/:id - Must be able to update an ONG", async () => {
    const loginResponse = await request(app)
      .post("/login")
      .send(mockedOngLogin);
    const ong = await request(app)
      .get("/ong")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);
    const ongId = ong.body[0].id;
    const ongValue = { companyName: "Correção" };
    const response = await request(app)
      .patch(`/ong/${ongId}`)
      .send(ongValue)
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("companyName");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("cnpj");
    expect(response.body).toHaveProperty("phone");
    expect(response.body).toHaveProperty("github");
    expect(response.body).toHaveProperty("ownerName");
    expect(response.body).toHaveProperty("profilePicture");
    expect(response.body).toHaveProperty("linkedin");

    expect(response.body.companyName).toEqual(ongValue.companyName);
    expect(response.status).toBe(200);
  });

  test("PATCH /ong/:id -  should not be able to update ONG without authentication", async () => {
    const loginResponse = await request(app)
      .post("/login")
      .send(mockedOngLogin);
    const ongTobeUpdate = await request(app)
      .get("/ong")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);
    const response = await request(app).patch(
      `/ong/${ongTobeUpdate.body[0].id}`
    );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("PATCH /ong/:id - should not be able to update ONG with invalid id", async () => {
    const newValues = { name: "Joana Brito", email: "joanabrito@mail.com" };

    const loginResponse = await request(app)
      .post("/login")
      .send(mockedOngLogin);
    const token = `Bearer ${loginResponse.body.token}`;

    const ongTobeUpdateRequest = await request(app)
      .get("/ong")
      .set("Authorization", token);
    const ongTobeUpdateId = ongTobeUpdateRequest.body[0].id;

    const response = await request(app)
      .patch(`/ong/13970660-5dbe-423a-9a9d-5c23b37943cf`)
      .set("Authorization", token)
      .send(newValues);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });
});
