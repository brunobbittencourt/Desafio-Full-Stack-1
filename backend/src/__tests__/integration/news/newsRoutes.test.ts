import { DataSource } from "typeorm";
import AppDataSource from "../../../data-source";
import request from "supertest";
import app from "../../../app";

import {
  mockedNews,
  mockedToBeDeletedNews,
  mockedAdminUser,
  mockedUser,
} from "../../mocks";

describe("/news", () => {
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
    await request(app).post("/users").send(mockedAdminUser);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("POST /news - Must be able to create news", async () => {
    const adminUserResponse = await request(app)
      .post("/login")
      .send(mockedAdminUser);
    const response = await request(app)
      .post("/news")
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`)
      .send(mockedNews);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("site");
    expect(response.body).toHaveProperty("img");
    expect(response.body).toHaveProperty("user");
    expect(response.status).toEqual(201);
  });

  test("POST /news - Not logged in users must not be able to create news", async () => {
    const response = await request(app).post("/news").send(mockedNews);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toEqual(401);
  });

  test("POST /news - Not admin users must not be able to create news", async () => {
    const userResponse = await request(app).post("/login").send(mockedUser);

    const response = await request(app)
      .post("/news")
      .set("Authorization", `Bearer ${userResponse.body.token}`)
      .send(mockedNews);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toEqual(403);
  });

  test("GET /news - Must be able to list news", async () => {
    const adminUserResponse = await request(app)
      .post("/login")
      .send(mockedAdminUser);

    const response = await request(app)
      .get("/news")
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`);

    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("title");
    expect(response.body[0]).toHaveProperty("description");
    expect(response.body[0]).toHaveProperty("site");
    expect(response.body[0]).toHaveProperty("img");
    expect(response.status).toEqual(200);
  });

  test("GET /news - Not logged in users must not be able to list news", async () => {
    const response = await request(app).get("/news");

    expect(response.body).toHaveProperty("message");
    expect(response.status).toEqual(401);
  });

  test("GET /news/:id - Must be able to list news by id", async () => {
    const adminUserResponse = await request(app)
      .post("/login")
      .send(mockedAdminUser);

    const news = await request(app)
      .get("/news")
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`);

    const newsId = news.body[0].id;

    const response = await request(app)
      .get(`/news/${newsId}`)
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("site");
    expect(response.body).toHaveProperty("img");
    expect(response.status).toEqual(200);
  });

  test("GET /news/:id - Must not be able to list non-existing news", async () => {
    const response = await request(app).get(`/news/1`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toEqual(404);
  });

  test("PATCH /news/:id - Must be able to update news", async () => {
    const adminUserResponse = await request(app)
      .post("/login")
      .send(mockedAdminUser);

    const news = await request(app)
      .get("/news")
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`);

    const newsId = news.body[0].id;
    const newsValue = { title: "Correção" };
    const response = await request(app)
      .patch(`/news/${newsId}`)
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`)
      .send(newsValue);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("site");
    expect(response.body).toHaveProperty("img");
    expect(response.body.title).toEqual(newsValue.title);
    expect(response.status).toBe(200);
  });

  test("PATCH /news/:id - Must not be able to update a non-existing news", async () => {
    const newsValue = { title: "Correção" };

    const adminUserResponse = await request(app)
      .post("/login")
      .send(mockedAdminUser);

    const response = await request(app)
      .patch(`/news/1`)
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`)
      .send(newsValue);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("PATCH /news/:id - Not admin users must not be able to update news", async () => {
    const newsValue = { title: "Correção" };

    const userResponse = await request(app).post("/login").send(mockedUser);

    const response = await request(app)
      .patch(`/news/1`)
      .set("Authorization", `Bearer ${userResponse.body.token}`)
      .send(newsValue);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });

  test("DELETE /news/:id - Must be able to delete news", async () => {
    const adminUserResponse = await request(app)
      .post("/login")
      .send(mockedAdminUser);

    const newsToBeDeleted = await request(app)
      .post("/news")
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`)
      .send(mockedToBeDeletedNews);

    const newsId = newsToBeDeleted.body.id;

    const response = await request(app)
      .delete(`/news/${newsId}`)
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`);
    const findNews = await request(app)
      .get(`/news/${newsId}`)
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`);

    expect(response.status).toBe(204);
    expect(findNews.body.deletedAt).not.toBe(null);
  });

  test("DELETE /news/:id - Must not be able to delete a non-existing news", async () => {
    const adminUserResponse = await request(app)
      .post("/login")
      .send(mockedAdminUser);

    const response = await request(app)
      .delete(`/news/1`)
      .set("Authorization", `Bearer ${adminUserResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(404);
  });

  test("PATCH /news/:id - Not admin users must not be able to update news", async () => {
    const userResponse = await request(app).post("/login").send(mockedUser);

    const response = await request(app)
      .delete(`/news/1`)
      .set("Authorization", `Bearer ${userResponse.body.token}`);

    expect(response.body).toHaveProperty("message");
    expect(response.status).toBe(403);
  });
});
