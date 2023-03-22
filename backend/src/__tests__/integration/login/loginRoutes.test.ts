import request from "supertest";
import { DataSource } from "typeorm";
import app from "../../../app";
import AppDataSource from "../../../data-source";

import {
  mockedAdmin,
  mockedOng,
  mockedOngLogin,
  mockedUser,
  mockedUserLogin,
} from "../../mocks";

describe("/login", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    await request(app).post("/users").send(mockedUser);
    await request(app).post("/ong").send(mockedOng);
    await request(app).post("/users").send(mockedAdmin);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /login -  should be able to login with the User", async () => {
    const response = await request(app).post("/login").send(mockedUserLogin);

    expect(response.body).toHaveProperty("token");
    expect(response.status).toBe(200);
  });

  test("POST /login -  should be able to login with the ONG", async () => {
    const response = await request(app).post("/login").send(mockedOngLogin);

    expect(response.body).toHaveProperty("token");
    expect(response.status).toBe(200);
  });

  test("POST /login -  should not be able to login with incorrect email", async () => {
    const response = await request(app).post("/login").send({
      email: "felipe@mail.com",
      password: "123456",
    });

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("POST /login -  should not be able to login with incorrect password", async () => {
    const response = await request(app).post("/login").send({
      email: "rafaelquadros@mail.com",
      password: "1234567",
    });

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });
});
