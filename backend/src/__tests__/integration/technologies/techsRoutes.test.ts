import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";
import { mockedUser, mockedUserLogin } from "../../mocks";

describe("/technologies", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => {
        connection = res;
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
    await request(app).post(
      `/technologies/${process.env.PG_CODE_FOR_INSERT_TECHS}`
    );
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("GET /technologies -  Must be able to list technologies", async () => {
    await request(app).post("/users").send(mockedUser);

    const userLoginResponse = await request(app)
      .post("/login")
      .send(mockedUserLogin);

    const response = await request(app)
      .get("/technologies")
      .set("Authorization", `Bearer ${userLoginResponse.body.token}`);

    expect(response.body).toHaveLength(19);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
  });

  test("POST /users/technologies/:id -  Must be able to add technologies on user", async () => {
    const user = await request(app).post("/login").send(mockedUserLogin);

    const technologies = await request(app)
      .get("/technologies")
      .set("Authorization", `Bearer ${user.body.token}`);

    const response = await request(app)
      .post(`/users/technologies/${technologies.body[0].id}`)
      .set("Authorization", `Bearer ${user.body.token}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("github");
    expect(response.body).toHaveProperty("linkedin");
    expect(response.body).toHaveProperty("profilePicture");
    expect(response.body).toHaveProperty("isAdm");
    expect(response.body).toHaveProperty("isActive");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body).toHaveProperty("technologies");
  });

  test("GET /technologies -  should not be able to list technologies without authentication", async () => {
    const response = await request(app).get("/technologies");

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("POST /users/technologies/:id -  should not be able to add technologies without authentication", async () => {
    const response = await request(app).post(
      "/users/technologies/ab6506d5-d229-48b1-a466-de986376459b"
    );

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });

  test("POST /users/technologies/:id -  should not be able to add technologies with invalid id", async () => {
    const response = await request(app).post("/users/technologies/test");

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(401);
  });
});
